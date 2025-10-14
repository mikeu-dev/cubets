/**
 * @module GameOverSystem
 * @pattern State Transition Pattern + UI Overlay Pattern
 *
 * Menangani kondisi game over:
 * - Menampilkan pesan visual
 * - Efek flash neon
 * - Mengatur restart state
 */

import * as THREE from 'three';
import { gsap } from 'gsap';

export interface GameOverSystem {
  trigger: () => void;
  reset: () => void;
  isGameOver: boolean;
}

/**
 * Membuat sistem game over neon dengan UI overlay dan efek flash.
 */
export function createGameOverSystem(scene: THREE.Scene, container: HTMLElement): GameOverSystem {
  let isGameOver = false;

  // 💡 Flash putih
  const flashLight = new THREE.PointLight(0xffffff, 0, 100);
  scene.add(flashLight);

  // 🕹️ UI Overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.fontFamily = '"Orbitron", sans-serif';
  overlay.style.fontSize = '48px';
  overlay.style.color = '#ff00ff';
  overlay.style.textShadow = '0 0 20px #ff00ff, 0 0 40px #ff00ff';
  overlay.style.display = 'none';
  overlay.textContent = 'GAME OVER\nPress R to Restart';
  overlay.style.textAlign = 'center';
  overlay.style.whiteSpace = 'pre-line';
  container.appendChild(overlay);

  // 🔥 Trigger Game Over
  function trigger() {
    if (isGameOver) return;
    isGameOver = true;

    // Flash cepat
    flashLight.intensity = 5;
    flashLight.position.set(0, 0, 10);
    gsap.to(flashLight, { intensity: 0, duration: 1, ease: 'power2.out' });

    // Munculkan overlay
    overlay.style.display = 'block';
    overlay.animate(
      [
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
        { transform: 'translate(-50%, -50%) scale(1)' },
      ],
      { duration: 800, easing: 'ease-out', fill: 'forwards' },
    );
  }

  // 🔄 Reset Game
  function reset() {
    isGameOver = false;
    overlay.style.display = 'none';
  }

  // Tekan R untuk restart
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r' && isGameOver) {
      window.dispatchEvent(new Event('gameRestart'));
    }
  });

  return { trigger, reset, isGameOver };
}
