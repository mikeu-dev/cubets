/**
 * @module Score
 * @pattern Observable State Pattern + UI Overlay Pattern
 *
 * Modul ini bertanggung jawab untuk:
 * - Menyimpan nilai skor (state)
 * - Menampilkan ke layar dalam bentuk elemen HTML
 * - Memungkinkan sistem lain (seperti collision) untuk memicu perubahan
 */

import type { ScoreSystem } from "../types";

/**
 * Membuat sistem skor dengan tampilan UI neon glow.
 *
 * @param {HTMLElement} container - elemen tempat game dirender (biasanya div utama)
 */
export function createScoreSystem(container: HTMLElement, onLevelUp?: () => void): ScoreSystem {
  let score = 0;
  let level = 1;
  // 🟩 Elemen HTML overlay
  const scoreEl = document.createElement('div');
  scoreEl.style.position = 'absolute';
  scoreEl.style.top = '10px';
  scoreEl.style.left = '10px';
  scoreEl.style.fontFamily = '"Orbitron", sans-serif';
  scoreEl.style.fontSize = '24px';
  scoreEl.style.color = '#00ffff';
  scoreEl.style.textShadow = '0 0 10px #00ffff, 0 0 20px #00ffff';
  scoreEl.style.userSelect = 'none';
  scoreEl.textContent = 'SCORE: 0';

  // Pastikan posisi absolute-nya sesuai container
  container.style.position = 'relative';
  container.appendChild(scoreEl);

  // --- Fungsi utama ---
  function updateDisplay() {
    scoreEl.textContent = `SCORE: ${score}`;
  }

  return {
    add(points: number) {
      score += points;
      updateDisplay();
        if (score >= level * 10) {
      level++;
      onLevelUp?.(); // 🔥 panggil transisi di sini
    }
      // Efek animasi kecil saat skor naik
      scoreEl.animate(
        [
          { transform: 'scale(1)', textShadow: '0 0 10px #00ffff' },
          { transform: 'scale(1.2)', textShadow: '0 0 25px #00ffff' },
          { transform: 'scale(1)', textShadow: '0 0 10px #00ffff' },
        ],
        { duration: 300, easing: 'ease-out' },
      );
    },
    reset() {
      score = 0;
      updateDisplay();
    },
    getValue() {
      return score;
    },
    destroy() {
      container.removeChild(scoreEl);
    },
  };
}
