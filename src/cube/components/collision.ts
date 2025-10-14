/**
 * @module Collision
 * @pattern System Pattern (ECS)
 *
 * Modul ini berfungsi sebagai *system* dalam arsitektur ECS:
 * - Tidak menyimpan state internal
 * - Hanya membaca posisi entity (player, enemy)
 * - Melakukan aksi saat terjadi interaksi (collision)
 */

import * as THREE from 'three';
import { createEnemy } from './enemy';
import type { CollisionSystem, ParticleSystem, ScoreSystem } from '../types';

/**
 * Membuat sistem deteksi tabrakan antara player dan musuh.
 *
 * @param {THREE.Scene} scene - referensi scene untuk manipulasi objek (respawn)
 * @param {number} radius - batas jarak untuk mendeteksi tabrakan
 */
export function createCollisionSystem(
  scene: THREE.Scene,
  radius = 0.6,
  scoreSystem?: ScoreSystem,
  particles?: ParticleSystem // partikel opsional
): CollisionSystem {
  return {
    update(playerMesh, enemies) {
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const distance = playerMesh.position.distanceTo(enemy.mesh.position);

        if (distance < radius) {
          scene.remove(enemy.mesh);
          const newEnemy = createEnemy(scene, 8);
          enemies[i] = newEnemy;

          // 🟩 Efek partikel neon saat tabrakan
          particles?.spawn(playerMesh.position);

          // 🟦 Tambah skor
          scoreSystem?.add(10);
        }
      }
    },
  };
}

/**
 * Efek singkat saat collision (seperti "ledakan neon").
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Vector3} position
 */
function spawnNeonFlash(scene: THREE.Scene, position: THREE.Vector3) {
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );
  flash.position.copy(position);
  scene.add(flash);

  // Efek menghilang pelan-pelan
  let alpha = 1;
  const fade = () => {
    alpha -= 0.05;
    flash.material.opacity = alpha;
    (flash.material as THREE.Material).transparent = true;
    flash.scale.multiplyScalar(1.05);
    if (alpha > 0) requestAnimationFrame(fade);
    else scene.remove(flash);
  };
  fade();
}
