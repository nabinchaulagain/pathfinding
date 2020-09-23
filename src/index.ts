import config from "./config";
import Board from "./Board";
import astar from "./algorithms/astar";
import dijkstra from "./algorithms/dijkstra";
import bestFirstSearch from "./algorithms/bestFirstSearch";

const algorithms = [astar, bestFirstSearch, dijkstra];

const algChooser: HTMLSelectElement = document.querySelector(
  "#algChooser"
) as HTMLSelectElement;

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = config.WIDTH;
canvas.height = config.WIDTH;

const board = new Board(
  config.WIDTH,
  config.ROWS,
  canvas,
  algorithms[algChooser.selectedIndex]
);
board.draw(ctx);
board.attachEventListeners();

algChooser.addEventListener("change", function () {
  board.solver = algorithms[algChooser.selectedIndex];
});

setInterval(() => {
  board.clearBoard(ctx);
  board.draw(ctx);
}, config.REFRESH_RATE);
