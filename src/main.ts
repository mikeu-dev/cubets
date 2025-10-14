import './style.css'
import { initNeonCube } from './cube/index';

const container = document.querySelector<HTMLDivElement>('#app')!
initNeonCube(container, { playerColor: 0xff00ff });

