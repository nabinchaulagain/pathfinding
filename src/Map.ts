class GameMap {
  width: number;
  rows: number;
  constructor(width: number, rows: number) {
    this.width = width;
    this.rows = rows;
  }
  draw(ctx: CanvasRenderingContext2D) {
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
}

export default GameMap;
