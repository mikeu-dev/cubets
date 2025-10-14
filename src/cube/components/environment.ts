import * as THREE from 'three';

export function createEnvironment(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight(0x4040ff, 0.4);
  const light1 = new THREE.PointLight(0x00ffff, 2, 50);
  light1.position.set(5, 5, 10);

  const light2 = new THREE.PointLight(0xff00ff, 1.5, 50);
  light2.position.set(-5, -5, 10);

  const grid = new THREE.GridHelper(20, 20, 0x00ffff, 0x5500ff);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -1;

  scene.add(ambient, light1, light2, grid);
}
