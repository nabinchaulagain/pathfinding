import config from "./config";
import Board from "./Board";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = config.WIDTH;
canvas.height = config.WIDTH;

const board = new Board(config.WIDTH, config.ROWS, canvas);
board.draw(ctx);
board.attachEventListeners();

setInterval(() => {
  board.clearBoard(ctx);
  board.draw(ctx);
}, config.REFRESH_RATE);
