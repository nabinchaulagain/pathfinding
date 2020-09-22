import config from "./config";
import GameMap from "./Map";
import Squares from "./Squares";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = config.WIDTH;
canvas.height = config.WIDTH;

const map = new GameMap(config.WIDTH, config.ROWS);
map.draw(ctx);
const squares = new Squares(config.WIDTH, config.ROWS);
squares.draw(ctx);
