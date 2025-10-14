/**
 * @module TransitionSystem
 * @pattern Event-Driven Visual Pattern + Scene FX Pattern
 *
 * Sistem efek transisi neon (misalnya saat naik level).
 * Efek: flash layar, perubahan warna ambient light, dan latar belakang.
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import type { TransitionSystem } from '../types';

/**
 * Membuat sistem efek transisi neon.
 * @param scene Scene utama game
 * @param camera Kamera aktif
 */
export function createTransitionSystem(
  scene: THREE.Scene,
  _camera: THREE.Camera,
): TransitionSystem {
  // Cahaya flash (sementara)
  const flashLight = new THREE.PointLight(0xffffff, 0, 100);
  scene.add(flashLight);

  // Warna latar belakang default
  const baseColors = [0x000020, 0x100022, 0x001033, 0x220033];
  let colorIndex = 0;

  function triggerLevelUp() {
    // 🔆 Flash putih cepat
    flashLight.intensity = 5;
    flashLight.position.set(0, 0, 10);
    gsap.to(flashLight, { intensity: 0, duration: 0.8, ease: 'power2.out' });

    // 🌈 Ubah warna latar belakang
    colorIndex = (colorIndex + 1) % baseColors.length;
    const targetColor = new THREE.Color(baseColors[colorIndex]);
    gsap.to(scene.background, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 2,
      ease: 'sine.inOut',
    });
  }

  return { triggerLevelUp };
}
