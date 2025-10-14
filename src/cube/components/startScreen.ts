/**
 * @module StartScreen
 * @pattern State Gate Pattern + UI Overlay Pattern + Guided UX Pattern
 *
 * Komponen ini menampilkan tampilan awal game ("Press SPACE to Start")
 * serta panduan kontrol (WASD). Game akan berhenti sementara sampai pemain
 * menekan tombol SPACE untuk memulai.
 */

import type { StartScreen } from '../types';

/**
 * Membuat overlay start screen dengan info kontrol WASD.
 *
 * @param container Elemen container utama game.
 */
export function createStartScreen(container: HTMLElement): StartScreen {
  let started = false;

  // 🟩 Elemen overlay utama
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(0, 0, 20, 0.85)';
  overlay.style.backdropFilter = 'blur(6px)';
  overlay.style.color = '#00ffff';
  overlay.style.fontFamily = '"Orbitron", sans-serif';
  overlay.style.textAlign = 'center';
  overlay.style.userSelect = 'none';

  // 🎮 Konten utama
  overlay.innerHTML = `
    <div style="max-width: 480px;">
      <h1 style="
        font-size: 42px;
        color: #00ffff;
        margin-bottom: 20px;
        text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
      ">
        ⚡ CubeTS ⚡
      </h1>
      <p style="
        font-size: 20px;
        letter-spacing: 1px;
        color: #aaffff;
        margin-bottom: 40px;
      ">
        Press <span style="color:#fff;">SPACE</span> to Start
      </p>

      <div style="
        display: grid;
        grid-template-columns: repeat(3, 50px);
        grid-template-rows: repeat(2, 50px);
        gap: 10px;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        filter: drop-shadow(0 0 10px #00ffff);
      ">
        <div></div>
        <div style="
          border: 2px solid #00ffff;
          border-radius: 8px;
          color: #00ffff;
          font-size: 18px;
          line-height: 46px;
          font-weight: bold;
        ">W</div>
        <div></div>
        <div style="
          border: 2px solid #00ffff;
          border-radius: 8px;
          color: #00ffff;
          font-size: 18px;
          line-height: 46px;
          font-weight: bold;
        ">A</div>
        <div style="
          border: 2px solid #00ffff;
          border-radius: 8px;
          color: #00ffff;
          font-size: 18px;
          line-height: 46px;
          font-weight: bold;
        ">S</div>
        <div style="
          border: 2px solid #00ffff;
          border-radius: 8px;
          color: #00ffff;
          font-size: 18px;
          line-height: 46px;
          font-weight: bold;
        ">D</div>
      </div>

      <p style="
        margin-top: 25px;
        font-size: 14px;
        color: #66ffff;
        opacity: 0.8;
      ">
        Use <b>WASD</b> to Move
      </p>
    </div>
  `;

  container.style.position = 'relative';
  container.appendChild(overlay);

  // 🎹 Input handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !started) {
      started = true;
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 800,
        easing: 'ease-in-out',
        fill: 'forwards',
      }).onfinish = () => overlay.remove();
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  return {
    get started() {
      return started;
    },
    update() {
      // (opsional) misalnya nanti untuk efek glow dinamis
    },
    destroy() {
      window.removeEventListener('keydown', handleKeyDown);
      overlay.remove();
    },
  };
}
