/**
 * @module HitSystem
 * @pattern Observable State Pattern + UI Overlay Pattern
 *
 * Sistem hit / nyawa pemain. Bisa ditabrak beberapa kali sebelum game over.
 */

import type { HitSystem } from '../types';

/**
 * Membuat sistem hit counter.
 *
 * @param container Elemen container utama game (untuk overlay)
 * @param maxHits Jumlah maksimum hits yang diperbolehkan
 */
export function createHitSystem(container: HTMLElement, maxHits = 3): HitSystem {
  let hitsRemaining = maxHits;

  // 🟩 Elemen overlay hits
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '10px';
  overlay.style.right = '10px';
  overlay.style.fontFamily = '"Orbitron", sans-serif';
  overlay.style.fontSize = '20px';
  overlay.style.color = '#ff5555';
  overlay.style.textShadow = '0 0 10px #ff5555, 0 0 20px #ff5555';
  overlay.style.userSelect = 'none';
  overlay.textContent = `Hits Remaining: ${hitsRemaining}`;

  container.style.position = 'relative';
  container.appendChild(overlay);

  function flashRed() {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.inset = '0';
    flash.style.background = 'rgba(255, 0, 0, 0.4)';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.5s ease';
    container.appendChild(flash);
    setTimeout(() => (flash.style.opacity = '0'), 50);
    setTimeout(() => flash.remove(), 500);
  }

  function takeHit() {
    hitsRemaining = Math.max(0, hitsRemaining - 1);
    overlay.textContent = `Hits Remaining: ${hitsRemaining}`;
    flashRed();
    return hitsRemaining;
  }

  function reset() {
    hitsRemaining = maxHits;
    overlay.textContent = `Hits Remaining: ${hitsRemaining}`;
  }

  return {
    takeHit,
    reset,
    get hitsRemaining() {
      return hitsRemaining;
    },
    destroy() {
      overlay.remove();
    },
  };
}
