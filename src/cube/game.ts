/**
 * @module Game
 * @pattern Composition Root
 */

import * as THREE from 'three';
import { createPlayer } from './components/player';
import { createEnvironment } from './components/environment';
import { initControls } from './components/controls';
import { createEnemies } from './components/enemy';
import { createCollisionSystem } from './components/collision';
import { createScoreSystem } from './components/score';
import { createParticleSystem } from './components/particles';
import { createTrail } from './components/trail';
import { createTransitionSystem } from './components/transition';
import { createGameOverSystem } from './components/gameOver';
import { createStartScreen } from './components/startScreen';
import { createHitSystem } from './components/hitSystem';
import { createHighScoreSystem } from './components/highScore';

import { MultiplayerService } from '../services/MultiplayerService';
import { createRemotePlayerManager } from './components/remotePlayers';

export function initGameLogic(
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  container: HTMLElement,
  multiplayer?: MultiplayerService
) {
  const player = createPlayer(scene);
  const environment = createEnvironment(scene);

  const startScreen = createStartScreen(container, scene);
  const controls = initControls();
  const enemies = createEnemies(scene, 10, 8);
  const transition = createTransitionSystem(scene, camera);
  const gameOverSystem = createGameOverSystem(scene, container);
  const scoreSystem = createScoreSystem(container, () => transition.triggerLevelUp());
  const highScoreSystem = createHighScoreSystem(container);
  const particles = createParticleSystem(scene, 300);
  const collisionSystem = createCollisionSystem(scene, 0.8, scoreSystem, particles);
  const trail = createTrail(scene, 40);
  const hitSystem = createHitSystem(container, 3); // max 3 hits

  // Remote Players
  const remotePlayers = createRemotePlayerManager(scene);

  if (multiplayer) {
    multiplayer.onReceiveState((state: any) => {
      remotePlayers.updatePlayer(state.playerId, state.x, state.y);
    });
  }

  window.addEventListener('gameRestart', () => {
    scoreSystem.reset();
    highScoreSystem.checkAndUpdate(scoreSystem.getValue());
    player.mesh.position.set(0, 0, 0);
    enemies.forEach((enemy) => {
      enemy.mesh.position.x = (Math.random() - 0.5) * 10;
      enemy.mesh.position.y = (Math.random() - 0.5) * 10;
      enemy.hasHitPlayer = false; // reset flag
    });
    hitSystem.reset();
    gameOverSystem.reset();
  });

  let lastSentTime = 0;
  const sendInterval = 50; // ms (20 updates/sec)

  function update() {
    if (!startScreen.started) return;
    if (gameOverSystem.isGameOver) return;

    player.update(controls.keys);
    const bounds = environment.bounds;
    player.mesh.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, player.mesh.position.x));
    player.mesh.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, player.mesh.position.y));

    // Multiplayer Send
    if (multiplayer) {
      const now = Date.now();
      if (now - lastSentTime > sendInterval) {
        multiplayer.sendState({
          x: player.mesh.position.x,
          y: player.mesh.position.y,
          score: scoreSystem.getValue(),
          lives: hitSystem.hitsRemaining
        });
        lastSentTime = now;
      }
    }

    const lerpFactor = 0.1;
    camera.position.x += (player.mesh.position.x - camera.position.x) * lerpFactor;
    camera.position.y += (player.mesh.position.y - camera.position.y) * lerpFactor;
    camera.updateProjectionMatrix();
    particles.update();
    trail.update(player.mesh.position);
    enemies.forEach((enemy) => enemy.update());
    collisionSystem.update(player.mesh, enemies);

    const playerBox = new THREE.Box3().setFromObject(player.mesh);

    for (const enemy of enemies) {
      if (!enemy.dangerous || enemy.hasHitPlayer) continue;

      const enemyBox = new THREE.Box3().setFromObject(enemy.mesh);

      if (playerBox.intersectsBox(enemyBox)) {
        enemy.hasHitPlayer = true;
        const remaining = hitSystem.takeHit();

        if (remaining <= 0) {
          highScoreSystem.checkAndUpdate(scoreSystem.getValue());
          gameOverSystem.trigger();
        }

        // reset posisi musuh agar tidak langsung menabrak lagi
        enemy.mesh.position.x = (Math.random() - 0.5) * 10;
        enemy.mesh.position.y = (Math.random() - 0.5) * 10;
        enemy.hasHitPlayer = false; // optional, tergantung ingin enemy bisa hit lagi
      }
    }
  }

  return { update };
}
