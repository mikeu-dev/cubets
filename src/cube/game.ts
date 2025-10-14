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

export function initGameLogic(scene: THREE.Scene, camera: THREE.OrthographicCamera, container: HTMLElement) {
  const player = createPlayer(scene);
  createEnvironment(scene);
  const startScreen = createStartScreen(container);
  const controls = initControls();
  const enemies = createEnemies(scene, 10, 8);
  const transition = createTransitionSystem(scene, camera);
  const gameOverSystem = createGameOverSystem(scene, container);
  const scoreSystem = createScoreSystem(container, () => {
    transition.triggerLevelUp();
  });
  const particles = createParticleSystem(scene, 300);
  const collisionSystem = createCollisionSystem(scene, 0.8, scoreSystem, particles);
  const trail = createTrail(scene, 40);
  window.addEventListener('gameRestart', () => {
    scoreSystem.reset();
    player.mesh.position.set(0, 0, 0);
    enemies.forEach((enemy) => {
      enemy.mesh.position.x = (Math.random() - 0.5) * 10;
      enemy.mesh.position.y = (Math.random() - 0.5) * 10;
    });
    gameOverSystem.reset();
  });

  function update() {
    if (!startScreen.started) return;
    if (gameOverSystem.isGameOver) return;

    player.update(controls.keys);
    particles.update();
    trail.update(player.mesh.position);
    enemies.forEach((enemy) => enemy.update());
    collisionSystem.update(player.mesh, enemies);

     for (const enemy of enemies) {
      const dist = player.mesh.position.distanceTo(enemy.mesh.position);
      if (dist < 0.5) {
        gameOverSystem.trigger();
      }
    }
  }

  return { update };
}
