enum SquareColor {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Black = "black",
  White = "white",
}

class Square {
  row: number;
  col: number;
  width: number;
  x: number;
  y: number;
  color: SquareColor;

  constructor(
    row: number,
    col: number,
    width: number,
    color: SquareColor = SquareColor.Green
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
}

export { Square, SquareColor };
