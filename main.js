import {MemoryGame} from "./script.js";
const restartBtn = document.getElementById('restartBtn');
const resumeBtn = document.getElementById('resumeBtn');
const game = new MemoryGame({restartBtn, resumeBtn});
restartBtn.addEventListener('click', () => game.restartGame());
resumeBtn.addEventListener('click', () => game.resumeGame());
window.addEventListener('load', () => game.loadGame());
