import './style.css';
import { initNeonCube } from './cube/index';
import { MultiplayerService } from './services/MultiplayerService';

const container = document.querySelector<HTMLDivElement>('#app')!;
initNeonCube(container);

const multiplayer = new MultiplayerService();
multiplayer.connect();
