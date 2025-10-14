/**
 * @module Trail
 * @pattern Buffer Recycling Pattern + Visual Effect Pattern
 *
 * Efek jejak neon di belakang player.
 * Menggunakan garis (Line) dengan buffer posisi yang diperbarui setiap frame.
 */

import * as THREE from 'three';
import type { TrailSystem } from '../types';

/**
 * Membuat efek jejak neon (trail) di belakang objek bergerak.
 *
 * @param scene - Scene tempat trail ditambahkan
 * @param length - Panjang maksimum jejak (jumlah titik)
 */
export function createTrail(scene: THREE.Scene, length = 50): TrailSystem {
  const positions = new Float32Array(length * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  const line = new THREE.Line(geometry, material);
  scene.add(line);

  // posisi sebelumnya
  let index = 0;
  let isFull = false;

  function update(position: THREE.Vector3) {
    // geser data buffer ke kiri
    if (isFull) {
      for (let i = 0; i < (length - 1) * 3; i++) {
        positions[i] = positions[i + 3];
      }
    }

    // tambahkan posisi terbaru di ujung
    positions[(isFull ? length - 1 : index) * 3 + 0] = position.x;
    positions[(isFull ? length - 1 : index) * 3 + 1] = position.y;
    positions[(isFull ? length - 1 : index) * 3 + 2] = position.z;

    if (!isFull) {
      index++;
      if (index >= length) isFull = true;
    }

    geometry.attributes.position.needsUpdate = true;
  }

  return { update };
}
