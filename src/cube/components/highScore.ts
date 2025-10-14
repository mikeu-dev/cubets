/**
 * @module HighScore
 * @pattern Observable State Pattern + UI Overlay Pattern
 *
 * Modul ini bertanggung jawab untuk:
 * - Menyimpan high score (state) menggunakan localStorage
 * - Menampilkan high score di layar
 * - Memungkinkan sistem lain untuk memeriksa atau memperbarui high score
 */

import type { HighScoreSystem } from '../types';

/**
 * Membuat sistem high score dengan UI neon glow.
 *
 * @param {HTMLElement} container - elemen tempat game dirender (biasanya div utama)
 */
export function createHighScoreSystem(container: HTMLElement): HighScoreSystem {
  // Ambil high score sebelumnya dari localStorage
  let highScore = parseInt(localStorage.getItem('highScore') || '0', 10);

  // 🟩 Elemen HTML overlay
  const highScoreEl = document.createElement('div');
  highScoreEl.style.position = 'absolute';
  highScoreEl.style.top = '40px';
  highScoreEl.style.left = '10px';
  highScoreEl.style.fontFamily = '"Orbitron", sans-serif';
  highScoreEl.style.fontSize = '20px';
  highScoreEl.style.color = '#ff00ff';
  highScoreEl.style.textShadow = '0 0 10px #ff00ff, 0 0 20px #ff00ff';
  highScoreEl.style.userSelect = 'none';
  highScoreEl.textContent = `HIGH SCORE: ${highScore}`;

  // Pastikan container position relative
  container.style.position = 'relative';
  container.appendChild(highScoreEl);

  function updateDisplay() {
    highScoreEl.textContent = `HIGH SCORE: ${highScore}`;
  }

  return {
    /**
     * Periksa dan update high score jika nilai baru lebih tinggi
     */
    checkAndUpdate(score: number) {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());
        updateDisplay();
        // animasi kecil saat high score naik
        highScoreEl.animate(
          [
            { transform: 'scale(1)', textShadow: '0 0 10px #ff00ff' },
            { transform: 'scale(1.2)', textShadow: '0 0 25px #ff00ff' },
            { transform: 'scale(1)', textShadow: '0 0 10px #ff00ff' },
          ],
          { duration: 300, easing: 'ease-out' },
        );
      }
    },
    reset() {
      highScore = 0;
      localStorage.setItem('highScore', '0');
      updateDisplay();
    },
    getValue() {
      return highScore;
    },
    destroy() {
      container.removeChild(highScoreEl);
    },
  };
}
