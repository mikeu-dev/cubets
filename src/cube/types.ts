import * as THREE from 'three';

export interface GameOptions {
  playerColor?: number;
  speed?: number;
}
export interface Enemy {
  mesh: THREE.Mesh;
  update: () => void;
}
export interface CollisionSystem {
  update: (_playerMesh: THREE.Mesh, _enemies: Enemy[]) => void;
}
export interface ScoreSystem {
  add(_points: number): void;
  reset(): void;
  getValue(): number;
  destroy(): void;
  onLevelUp?: () => void;
}
export interface ParticleSystem {
  spawn: (_position: THREE.Vector3) => void;
  update: () => void;
}
export interface TrailSystem {
  update: (_position: THREE.Vector3) => void;
}
export interface TransitionSystem {
  triggerLevelUp: () => void;
}
export interface StartScreen {
  /** Apakah game sudah dimulai */
  started: boolean;
  /** Hapus overlay dari DOM */
  destroy(): void;
  /** Update loop — opsional, misalnya untuk efek animasi overlay */
  update(): void;
}
