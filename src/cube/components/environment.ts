/**
 * @module Environment
 * @pattern Entity Component
 *
 * Membuat grid environment untuk referensi visual, tanpa geser yang bikin pusing.
 */

import * as THREE from 'three';

export function createEnvironment(scene: THREE.Scene) {
  // --- Lights ---
  const ambient = new THREE.AmbientLight(0x4040ff, 0.4);
  const light1 = new THREE.PointLight(0x00ffff, 2, 50);
  light1.position.set(5, 5, 10);

  const light2 = new THREE.PointLight(0xff00ff, 1.5, 50);
  light2.position.set(-5, -5, 10);

  scene.add(ambient, light1, light2);

  // --- Grid visual besar ---
  const gridSize = 200;
  const divisions = 40;
  const grid = new THREE.GridHelper(gridSize, divisions, 0x00ffff, 0x5500ff);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -1;
  scene.add(grid);

  // --- batas environment untuk collision ---
  const bounds = {
    minX: -gridSize / 2,
    maxX: gridSize / 2,
    minY: -gridSize / 2,
    maxY: gridSize / 2,
  };

  return { grid, bounds };
}
