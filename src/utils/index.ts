import { Point } from "../Square";
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
