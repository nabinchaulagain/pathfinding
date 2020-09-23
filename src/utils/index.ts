import { Point, Square } from "../Square";
import Board from "../Board";
export enum MouseClick {
  Left = 1,
  Middle,
  Right,
}

export const distance = (point1: Point, point2: Point): number =>
  Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y);

export const wait = function (millis: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millis);
  });
};

export const initializeScores = (
  board: Board,
  scoreFunc: (sq: Square) => number
) => {
  const scores: number[][] = [];
  for (let i = 0; i < board.rows; i++) {
    scores.push([]);
    for (let j = 0; j < board.rows; j++) {
      scores[i].push(scoreFunc(board.squares.getSquare(i, j)));
    }
  }
  return scores;
};
