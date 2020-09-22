import { Square } from "./Square";
class Squares {
  width: number;
  rows: number;
  squares: Square[][];
  constructor(width: number, rows: number) {
    this.width = width;
    this.rows = rows;
    this.squares = [];
    const squareWidth = Math.floor(width / rows);
    for (let i = 0; i < rows; i++) {
      this.squares.push([]);
      for (let j = 0; j < rows; j++) {
        this.squares[i].push(new Square(i, j, squareWidth));
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    for (const rows of this.squares) {
      for (const square of rows) {
        square.draw(ctx);
      }
    }
  }
}

export default Squares;
