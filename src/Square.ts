import Squares from "./Squares";

enum Color {
  Red = "red",
  Green = "lightgreen",
  Orange = "orange",
  Grey = "grey",
  White = "white",
  Yellow = "yellow",
}

type Point = {
  x: number;
  y: number;
};

class Square {
  row: number;
  col: number;
  width: number;
  x: number;
  y: number;
  color: Color;
  neighbors: Square[] = [];

  constructor(
    row: number,
    col: number,
    width: number,
    color: Color = Color.White
  ) {
    this.row = row;
    this.col = col;
    this.width = width;
    this.x = row * width;
    this.y = col * width;
    this.color = color;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.width);
    ctx.fill();
  }
  getPos(): Point {
    return { x: this.row, y: this.col };
  }

  reset(): void {
    this.color = Color.White;
  }
  makeObstacle(): void {
    this.color = Color.Grey;
  }
  makeGoal(): void {
    this.color = Color.Red;
  }
  makeStart(): void {
    this.color = Color.Yellow;
  }
  makeVisited(): void {
    this.color = Color.Orange;
  }
  makeOptimal(): void {
    this.color = Color.Green;
  }

  isObstacle(): boolean {
    return this.color === Color.Grey;
  }
  isGoal(): boolean {
    return this.color === Color.Red;
  }
  isStart(): boolean {
    return this.color === Color.Yellow;
  }
  isVisited(): boolean {
    return this.color === Color.Green;
  }
  isOptimal(): boolean {
    return this.color === Color.Orange;
  }
  updateNeighbors(squares: Squares, numRows: number): void {
    this.neighbors = [];
    //up
    if (
      this.row - 1 >= 0 &&
      !squares.getSquare(this.row - 1, this.col).isObstacle()
    ) {
      this.neighbors.push(squares.getSquare(this.row - 1, this.col));
    }
    //down
    if (
      this.row + 1 < numRows &&
      !squares.getSquare(this.row + 1, this.col).isObstacle()
    ) {
      this.neighbors.push(squares.getSquare(this.row + 1, this.col));
    }
    //left
    if (
      this.col - 1 >= 0 &&
      !squares.getSquare(this.row, this.col - 1).isObstacle()
    ) {
      this.neighbors.push(squares.getSquare(this.row, this.col - 1));
    }
    //right
    if (
      this.col + 1 < numRows &&
      !squares.getSquare(this.row, this.col + 1).isObstacle()
    ) {
      this.neighbors.push(squares.getSquare(this.row, this.col + 1));
    }
  }
}

export { Square, Color, Point };
