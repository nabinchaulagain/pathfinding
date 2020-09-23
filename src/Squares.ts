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
  draw(ctx: CanvasRenderingContext2D): void {
    for (const rows of this.squares) {
      for (const square of rows) {
        square.draw(ctx);
      }
    }
  }
  getSquare(row: number, col: number): Square {
    return this.squares[row][col];
  }
  updateNeighbors(): void {
    for (const row of this.squares) {
      for (const square of row) {
        square.updateNeighbors(this, this.rows);
      }
    }
  }
  getNumSquares(): number {
    return this.squares.length * this.squares[0].length;
  }

  reset(): void {
    for (const row of this.squares) {
      for (const square of row) {
        square.reset();
      }
    }
  }
  resetPathSquares(): void {
    for (const rows of this.squares) {
      for (const square of rows) {
        if (square.isVisited() || square.isOptimal()) {
          square.reset();
        }
      }
    }
  }
}

export default Squares;
