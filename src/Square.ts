enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Black = "black",
  White = "white",
  Yellow = "yellow",
}

class Square {
  row: number;
  col: number;
  width: number;
  x: number;
  y: number;
  color: Color;

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
  reset() {
    this.color = Color.White;
  }
  makeObstacle() {
    this.color = Color.Black;
  }
  makeGoal() {
    this.color = Color.Red;
  }
  makeStart() {
    this.color = Color.Yellow;
  }
  makeVisited() {
    this.color = Color.Green;
  }
}

export { Square, Color };
