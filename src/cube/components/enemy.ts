/**
 * @module Enemy
 * @pattern Entity Component + Spawner Pattern
 *
 * Modul ini menerapkan dua konsep:
 * 1. **Entity Component Pattern** → Tiap musuh berdiri sendiri, punya posisi & logika sendiri.
 * 2. **Spawner Pattern** → Modul ini bertanggung jawab membuat & mengelola kumpulan musuh.
 */

import * as THREE from 'three';
import type { Enemy } from '../types';

/**
 * Membuat satu enemy dengan posisi acak di dalam area permainan.
 *
 * @param {THREE.Scene} scene
 * @param {number} areaSize - batas area persegi tempat musuh muncul (contoh: 8 berarti koordinat -8..8)
 * @returns {Enemy}
 */
export function createEnemy(scene: THREE.Scene, areaSize = 8): Enemy {
  // --- [Visual] ---
  const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 3,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Posisi acak dalam area
  mesh.position.x = (Math.random() - 0.5) * 2 * areaSize;
  mesh.position.y = (Math.random() - 0.5) * 2 * areaSize;
  mesh.position.z = 0;

  scene.add(mesh);

  // --- [Animasi kecil agar hidup] ---
  let pulse = 0;

  function update() {
    pulse += 0.05;
    const intensity = 2 + Math.sin(pulse) * 0.5; // efek neon berdenyut
    (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
  }

  return { mesh, update };
}

/**
 * Membuat sekumpulan musuh acak dan menyimpannya untuk dikelola.
 *
 * @param {THREE.Scene} scene
 * @param {number} count - jumlah maksimum musuh
 * @param {number} areaSize - batas area kemunculan
 * @returns {Enemy[]} daftar musuh
 */
export function createEnemies(scene: THREE.Scene, count = 10, areaSize = 8): Enemy[] {
  const enemies: Enemy[] = [];

  for (let i = 0; i < count; i++) {
    enemies.push(createEnemy(scene, areaSize));
  }

  return enemies;
}
