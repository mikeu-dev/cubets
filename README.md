# ⚡ Neon Cube 2D

Game mini berbasis **Three.js** dengan gaya **neon cyberpunk** dan efek _glow_ futuristik.  
Kamu mengendalikan kubus bercahaya dan harus menghindari musuh yang bergerak acak — konsepnya mirip _snake arena_ versi 2D.

---

## 🎮 Fitur Utama

- 🌈 **Neon Glow FX** menggunakan `UnrealBloomPass`
- 🎮 **Kontrol WASD** untuk pergerakan 2D
- 💥 **Enemy spawn acak** dengan batas jumlah
- ✨ **Sistem skor & level-up**
- ⚡ **Transisi efek neon** saat naik level
- 🧩 **Modular Architecture** — komponen terpisah seperti `player`, `enemy`, `collision`, `score`, `transition`, dll.
- 🧠 **Design Patterns:**
  - _Composition Root_
  - _Event-Driven Visual Pattern_
  - _Observable State Pattern_
  - _UI Overlay Pattern_
  - _State Gate Pattern_

---

## 🧱 Struktur Folder

```bash
src/
├── cube/
│   ├── postprocessing/
│   │   ├── bloom.ts            # Bloom
│   ├── components/
│   │   ├── player.ts           # Player system
│   │   ├── enemy.ts            # Enemy spawner + AI
│   │   ├── environment.ts      # Grid neon & lighting
│   │   ├── controls.ts         # Input handler (WASD)
│   │   ├── score.ts            # UI overlay skor
│   │   ├── transition.ts       # Efek level-up neon
│   │   ├── collision.ts        # Collision
│   │   ├── particles.ts        # Efek partikel (opsional)
│   │   ├── trail.ts            # Jejak neon player
│   │   ├── gameOver.ts         # Game Over sistem
│   │   └── startScreen.ts      # UI awal "Press SPACE to Start"
│   ├── game.ts                 # Composition root
│   ├── types.ts                # Definisi tipe global
│   └── main.ts                 # Entry point untuk render scene
```

---

## 🚀 Instalasi & Menjalankan

# 1️⃣ Clone repo ini

git clone https://github.com/username/neon-cube-2d.git
cd neon-cube-2d

# 2️⃣ Install dependencies

npm install

# 3️⃣ Jalankan dalam mode dev

npm run dev

Kemudian buka http://localhost:5173 di browser.

---

## 🕹️ Cara Bermain

| Tombol  | Aksi            |
| ------- | --------------- |
| `W`     | Gerak ke atas   |
| `A`     | Gerak ke kiri   |
| `S`     | Gerak ke bawah  |
| `D`     | Gerak ke kanan  |
| `SPACE` | Mulai permainan |

Hindari musuh bercahaya dan kumpulkan skor sebanyak mungkin.
Setiap kelipatan 10 poin, level akan naik dengan efek neon baru.

---

## 🧩 Konsep Arsitektur

Sistem dibangun dengan pendekatan komponen independen yang berkomunikasi lewat Composition Root (game.ts).
Setiap sistem memiliki pattern annotation di bagian atas file agar mudah dipelajari.

Contoh:

```ts
/**
 * @module Score
 * @pattern Observable State Pattern + UI Overlay Pattern
 */
```

---

## 📜 Lisensi

Proyek ini bersifat open source dan dapat digunakan untuk keperluan pembelajaran atau portofolio pribadi.
Lisensi: MIT

## 💡 Catatan

# Proyek ini cocok untuk:

- Latihan memahami Three.js & game loop
- Portofolio web interaktif (frontend developer / creative coder)
- Dasar pengembangan game berbasis WebGL
