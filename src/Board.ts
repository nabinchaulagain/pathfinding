import Squares from "./Squares";
import { Square, Point } from "./Square";
import { MouseClick } from "./utils";
import { PathfindingList, ListEntry } from "./PathfindingList";
import config from "./config";

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

  constructor(width: number, rows: number, canvas: HTMLCanvasElement) {
    this.width = width;
    this.rows = rows;
    this.squares = new Squares(width, rows);
    this.mouseDown = false;
    this.canvas = canvas;
    this.squareWidth = Math.floor(this.width / this.rows);
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

  async backtrack(goal: ListEntry): Promise<void> {
    let curr = goal;
    while (true) {
      if (curr.from === null) {
        break;
      }
      if (curr.square !== this.goalSquare && curr.square !== this.startSquare) {
        curr.square.makeOptimal();
      }
      curr = curr.from;
      await wait(config.ANIM_WAIT_TIME);
    }
  }

  async solve(): Promise<void> {
    const openList = new PathfindingList();
    this.squares.updateNeighbors();
    if (!this.startSquare || !this.goalSquare) {
      return;
    }
    openList.put({
      square: this.startSquare,
      fscore: distance(this.startSquare.getPos(), this.goalSquare.getPos()),
      from: null,
    });
    const fscores: number[][] = [];
    const hscores: number[][] = [];
    const gscores: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      fscores.push([]);
      hscores.push([]);
      gscores.push([]);
      for (let j = 0; j < this.rows; j++) {
        fscores[i].push(Infinity);
        gscores[i].push(Infinity);
        hscores[i].push(
          distance(
            this.squares.getSquare(i, j).getPos(),
            this.goalSquare.getPos()
          )
        );
      }
    }
    fscores[this.startSquare.row][this.startSquare.col] =
      hscores[this.startSquare.row][this.startSquare.col];
    gscores[this.startSquare.row][this.startSquare.col] = 0;
    while (!openList.isEmpty()) {
      openList.sort();
      const current = openList.pop();
      const currSquare = current.square;
      if (currSquare === this.goalSquare) {
        console.log("Solved");
        await this.backtrack(current);
        return;
      }
      const gscore_neighbors = gscores[currSquare.row][currSquare.col] + 1;
      for (const neighbor of currSquare.neighbors) {
        if (gscore_neighbors < gscores[neighbor.row][neighbor.col]) {
          gscores[neighbor.row][neighbor.col] = gscore_neighbors;
          const fscoreNew =
            gscore_neighbors + hscores[neighbor.row][neighbor.col];
          fscores[neighbor.row][neighbor.col] = fscoreNew;
          if (neighbor !== this.startSquare && neighbor !== this.goalSquare) {
            neighbor.makeVisited();
          }
          openList.put({
            from: current,
            square: neighbor,
            fscore: fscoreNew,
          });
        }
      }
      await wait(config.ANIM_WAIT_TIME);
    }
    console.log("Unsolvable");
  }
  startSolving(): void {
    this.startedSolving = true;
    this.solve();
  }
}

const distance = (point1: Point, point2: Point): number =>
  Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y);

const wait = function (millis: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millis);
  });
};

export default Board;
