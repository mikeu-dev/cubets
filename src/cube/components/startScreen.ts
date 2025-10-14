/**
 * @module StartScreen
 * @pattern State Gate Pattern + UI Overlay Pattern + Guided UX Pattern + Scene FX Pattern
 *
 * Start screen futuristik:
 * - Neon glow animatif
 * - Background grid neon halus bergerak
 * - Neon flash saat SPACE ditekan
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import type { StartScreen as StartScreenType } from '../types';

export function createStartScreen(container: HTMLElement, scene: THREE.Scene): StartScreenType {
  let started = false;

  // 🌟 Flash neon
  const flashLight = new THREE.PointLight(0x00ffff, 0, 100);
  flashLight.position.set(0, 0, 10);
  scene.add(flashLight);

  // 🔲 Background Grid Neon
  const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x5500ff);
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.position.z = -1;
  scene.add(gridHelper);

  // 🟩 Overlay utama
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(0, 0, 20, 0.75)';
  overlay.style.backdropFilter = 'blur(6px)';
  overlay.style.color = '#00ffff';
  overlay.style.fontFamily = '"Orbitron", sans-serif';
  overlay.style.textAlign = 'center';
  overlay.style.userSelect = 'none';
  container.style.position = 'relative';
  container.appendChild(overlay);

  overlay.innerHTML = `
    <div style="max-width:480px;">
      <h1 class="title" style="
        font-size:42px;
        color:#00ffff;
        margin-bottom:20px;
        text-shadow:0 0 20px #00ffff,0 0 40px #00ffff;
      ">⚡ CubeTS ⚡</h1>
      <p class="start-text" style="
        font-size:20px;
        letter-spacing:1px;
        color:#aaffff;
        margin-bottom:40px;
      ">Press <span style="color:#fff;">SPACE</span> to Start</p>

      <div style=" display: grid; grid-template-columns: repeat(3, 50px); grid-template-rows: repeat(2, 50px); gap: 10px; justify-content: center; align-items: center; margin: 0 auto; filter: drop-shadow(0 0 10px #00ffff); "> <div></div> <div style=" border: 2px solid #00ffff; border-radius: 8px; color: #00ffff; font-size: 18px; line-height: 46px; font-weight: bold; ">W</div> <div></div> <div style=" border: 2px solid #00ffff; border-radius: 8px; color: #00ffff; font-size: 18px; line-height: 46px; font-weight: bold; ">A</div> <div style=" border: 2px solid #00ffff; border-radius: 8px; color: #00ffff; font-size: 18px; line-height: 46px; font-weight: bold; ">S</div> <div style=" border: 2px solid #00ffff; border-radius: 8px; color: #00ffff; font-size: 18px; line-height: 46px; font-weight: bold; ">D</div> </div>

      <p class="hint" style="
        margin-top:25px;
        font-size:14px;
        color:#66ffff;
        opacity:0.8;
      ">Use <b>WASD</b> to Move</p>
    </div>
  `;

  // ✨ Animasi neon halus
  const keys = overlay.querySelectorAll<HTMLElement>('.key');
  const title = overlay.querySelector<HTMLElement>('.title');
  const startText = overlay.querySelector<HTMLElement>('.start-text');

  keys.forEach((k, i) => {
    gsap.to(k.style, {
      textShadow: '0 0 15px #00ffff, 0 0 30px #00ffff',
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      delay: i * 0.1,
      ease: 'sine.inOut',
    });
  });

  if (title)
    gsap.to(title.style, {
      textShadow: '0 0 25px #00ffff, 0 0 50px #00ffff',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

  if (startText)
    gsap.to(startText.style, {
      textShadow: '0 0 15px #00ffff',
      color: '#ffffff',
      duration: 1.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

  // 🎹 Input handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !started) {
      started = true;

      // stop animasi grid
      cancelAnimationFrame(rafId);
      scene.remove(gridHelper);

      // Neon flash
      flashLight.intensity = 5;
      gsap.to(flashLight, { intensity: 0, duration: 0.8, ease: 'power2.out' });

      // Fade out overlay
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 800,
        easing: 'ease-in-out',
        fill: 'forwards',
      }).onfinish = () => overlay.remove();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  // 🌌 Animasi grid neon halus
  let gridOffset = 0;
  let rafId: number;
  const animateGrid = () => {
    gridOffset += 0.01;
    gridHelper.position.x = Math.sin(gridOffset) * 2;
    gridHelper.position.y = Math.cos(gridOffset) * 2;
    rafId = requestAnimationFrame(animateGrid);
  };
  animateGrid();

  return {
    get started() {
      return started;
    },
    update() {
      // bisa dipakai jika mau animasi tambahan overlay
    },
    destroy() {
      window.removeEventListener('keydown', handleKeyDown);
      overlay.remove();
      scene.remove(flashLight);
      scene.remove(gridHelper);
    },
  };
}
