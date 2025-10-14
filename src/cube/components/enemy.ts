/**
 * @module Enemy
 * @pattern Entity Component + Spawner Pattern
 *
 * Modul ini menerapkan dua konsep:
 * 1. Entity Component Pattern → Tiap musuh berdiri sendiri, punya posisi & logika sendiri.
 * 2. Spawner Pattern → Modul ini bertanggung jawab membuat & mengelola kumpulan musuh.
 */

import * as THREE from 'three';
import type { Enemy } from '../types';

/**
 * Membuat satu enemy dengan posisi acak di dalam area permainan.
 * Enemy berbahaya = bola merah menyala
 * Enemy aman = kubus ungu neon
 */
export function createEnemy(scene: THREE.Scene, areaSize = 8, dangerous = false): Enemy {
  // --- Tetapkan warna & bentuk sesuai dangerous ---
  const color = dangerous ? 0xff0000 : 0x9900ff;
  const geometry = dangerous
    ? new THREE.SphereGeometry(0.45, 16, 16) // bola merah berbahaya
    : new THREE.BoxGeometry(0.6, 0.6, 0.6); // kubus ungu aman

  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 3.5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 2 * areaSize;
  mesh.position.y = (Math.random() - 0.5) * 2 * areaSize;
  mesh.position.z = 0;

  scene.add(mesh);

  let pulse = 0;
  function update() {
    pulse += 0.05;
    const intensity = 2.5 + Math.sin(pulse) * 0.7;
    (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
  }

  // pastikan properti dangerous benar-benar tersedia di objek
  return { mesh, update, dangerous, hasHitPlayer: false };
}

/**
 * Membuat sekumpulan musuh.
 * 30% dari total musuh akan menjadi berbahaya (bola merah)
 */
export function createEnemies(scene: THREE.Scene, count = 10, areaSize = 8): Enemy[] {
  const enemies: Enemy[] = [];
  const dangerousCount = Math.floor(count * 0.3);

  for (let i = 0; i < count; i++) {
    const isDangerous = i < dangerousCount;
    enemies.push(createEnemy(scene, areaSize, isDangerous));
  }

  // acak urutan agar posisi tidak selalu sama
  return enemies.sort(() => Math.random() - 0.5);
}
