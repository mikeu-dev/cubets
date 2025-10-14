import * as THREE from 'three';

export function createPlayer(scene: THREE.Scene) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 2,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const speed = 0.1;

  function update(keys: Record<string, boolean>) {
    if (keys['w']) mesh.position.y += speed;
    if (keys['s']) mesh.position.y -= speed;
    if (keys['a']) mesh.position.x -= speed;
    if (keys['d']) mesh.position.x += speed;
  }

  return { mesh, update };
}
