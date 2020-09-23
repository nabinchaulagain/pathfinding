import Squares from "./Squares";
import { Square } from "./Square";
import { MouseClick } from "./utils/index";

type PathfindingAlgorithm = (board: Board) => Promise<void>;
class Board {
  width: number;
  rows: number;
  squares: Squares;
  mouseDown: boolean;
  canvas: HTMLCanvasElement;
  squareWidth: number;
  startSquare: Square | null = null;
  goalSquare: Square | null = null;
  heldBtn: MouseClick | null = null;
  startedSolving: boolean = false;
  solver: PathfindingAlgorithm;

  constructor(
    width: number,
    rows: number,
    canvas: HTMLCanvasElement,
    solver: PathfindingAlgorithm
  ) {
    this.width = width;
    this.rows = rows;
    this.squares = new Squares(width, rows);
    this.mouseDown = false;
    this.canvas = canvas;
    this.squareWidth = Math.floor(this.width / this.rows);
    this.solver = solver;
  }

  drawOutline(ctx: CanvasRenderingContext2D): void {
    const gap = Math.floor(this.width / this.rows);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = "destination-over";
    for (let i = 0; i <= this.rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gap);
      ctx.lineTo(this.width, i * gap);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * gap, 0);
      ctx.lineTo(i * gap, this.width);
      ctx.stroke();
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.drawOutline(ctx);
    this.squares.draw(ctx);
  }

  attachEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      if (this.startedSolving) {
        return;
      }
      this.heldBtn = event.which;
      this.handleHold(event);
      this.mouseDown = true;
    });
    this.canvas.addEventListener("mousemove", (event) => {
      if (this.startedSolving) {
        return;
      }
      if (this.mouseDown) {
        this.handleHold(event);
      }
    });
    document.addEventListener("mouseup", () => {
      if (this.startedSolving) {
        return;
      }
      this.heldBtn = null;
      this.mouseDown = false;
    });
    document
      .querySelector("#startVisBtn")
      ?.addEventListener("click", () => this.startSolving());
  }

  handleHold(event: MouseEvent): void {
    const x = event.clientX - this.canvas.offsetLeft;
    const y = event.clientY - this.canvas.offsetTop;
    const row = Math.floor(x / this.squareWidth);
    const col = Math.floor(y / this.squareWidth);
    const selectedSquare = this.squares.getSquare(row, col);
    if (this.heldBtn === MouseClick.Left) {
      this.handleLeftHold(selectedSquare);
    } else if (this.heldBtn === MouseClick.Right) {
      this.handleRightHold(selectedSquare);
    }
  }

  handleLeftHold(selectedSquare: Square): void {
    if (this.startSquare === null && selectedSquare !== this.goalSquare) {
      selectedSquare.makeStart();
      this.startSquare = selectedSquare;
    } else if (
      this.goalSquare === null &&
      selectedSquare !== this.startSquare
    ) {
      selectedSquare.makeGoal();
      this.goalSquare = selectedSquare;
    } else {
      if (
        selectedSquare !== this.startSquare &&
        selectedSquare !== this.goalSquare
      ) {
        selectedSquare.makeObstacle();
      }
    }
  }

  handleRightHold(selectedSquare: Square): void {
    if (selectedSquare === this.startSquare) {
      this.startSquare = null;
    }
    if (selectedSquare === this.goalSquare) {
      this.goalSquare = null;
    }
    selectedSquare.reset();
  }
  clearBoard(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.width);
    this.draw(ctx);
  }

  startSolving(): void {
    if (this.startSquare === null || this.goalSquare === null) {
      alert("Start and goal is not defined");
      return;
    }
    this.startedSolving = true;
    this.squares.updateNeighbors();
    this.solver(this);
  }
}

export default Board;
