import * as THREE from 'three';
import { initGameLogic } from './game';
import { createBloomComposer } from './postprocessing/bloom';

import { MultiplayerService } from '../services/MultiplayerService';

export function initNeonCube(container: HTMLElement, multiplayer?: MultiplayerService) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000010);

  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.OrthographicCamera(-aspect * 5, aspect * 5, 5, -5, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const game = initGameLogic(scene, camera, container, multiplayer);
  const composer = createBloomComposer(renderer, scene, camera, container);

  function animate() {
    requestAnimationFrame(animate);
    game.update();
    composer.render();
  }

  animate();

  return { destroy: () => container.removeChild(renderer.domElement), game };
}
