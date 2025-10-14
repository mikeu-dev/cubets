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
  particles?: ParticleSystem, // partikel opsional
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
