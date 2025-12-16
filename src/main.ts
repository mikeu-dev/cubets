import './style.css';
import { initNeonCube } from './cube/index';
import { MultiplayerService } from './services/MultiplayerService';

const multiplayer = new MultiplayerService();
multiplayer.connect();

const container = document.querySelector<HTMLDivElement>('#app')!;
initNeonCube(container, multiplayer);

