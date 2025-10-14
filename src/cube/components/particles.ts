/**
 * @module Particles
 * @pattern Object Pooling + Visual Effect Pattern
 *
 * Komponen ini membuat dan mengatur partikel neon kecil.
 * - Menggunakan **Object Pooling** agar efisien (tidak terus membuat objek baru)
 * - Setiap partikel berupa titik (Point) dengan warna neon
 */

import * as THREE from 'three';
import type { ParticleSystem } from '../types';

/**
 * Membuat sistem partikel neon ringan.
 *
 * @param {THREE.Scene} scene
 * @param {number} poolSize - jumlah maksimum partikel yang aktif sekaligus
 */
export function createParticleSystem(scene: THREE.Scene, poolSize = 200): ParticleSystem {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(poolSize * 3);
  const colors = new Float32Array(poolSize * 3);

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending, // efek neon bercahaya
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Data tiap partikel
  const velocities: THREE.Vector3[] = [];
  const lifetimes: number[] = [];
  for (let i = 0; i < poolSize; i++) {
    velocities.push(new THREE.Vector3());
    lifetimes.push(0);
  }

  function spawn(position: THREE.Vector3) {
    // Tambahkan beberapa partikel dari pool
    for (let i = 0; i < 20; i++) {
      const idx = Math.floor(Math.random() * poolSize);

      positions[idx * 3 + 0] = position.x;
      positions[idx * 3 + 1] = position.y;
      positions[idx * 3 + 2] = position.z;

      // Warna neon random antara biru & magenta
      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 1, 0.5);
      colors[idx * 3 + 0] = color.r;
      colors[idx * 3 + 1] = color.g;
      colors[idx * 3 + 2] = color.b;

      // Kecepatan acak
      velocities[idx].set(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        0
      );

      // Umur partikel
      lifetimes[idx] = 1.0;
    }
  }

  function update() {
    const delta = 0.016; // ~60fps
    for (let i = 0; i < poolSize; i++) {
      if (lifetimes[i] > 0) {
        lifetimes[i] -= delta;

        positions[i * 3 + 0] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;

        // efek gravitasi kecil ke bawah
        velocities[i].y -= 0.005;

        // efek fade-out
        const fade = lifetimes[i];
        colors[i * 3 + 0] *= fade;
        colors[i * 3 + 1] *= fade;
        colors[i * 3 + 2] *= fade;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }

  return { spawn, update };
}
