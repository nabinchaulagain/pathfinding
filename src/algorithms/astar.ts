import Board from "../Board";
import { ListEntry, PathfindingList } from "../utils/PathfindingList";
import { wait, distance, initializeScores } from "../utils/index";
import config from "../config";
import { Square } from "../Square";

export const backtrack = async function (
  board: Board,
  goal: ListEntry
): Promise<void> {
  let curr = goal;
  while (true) {
    if (curr.from === null) {
      break;
    }
    if (curr.square !== board.goalSquare && curr.square !== board.startSquare) {
      curr.square.makeOptimal();
    }
    curr = curr.from;
    await wait(config.ANIM_WAIT_TIME);
  }
};

const astar = async function (board: Board): Promise<boolean> {
  const openList = new PathfindingList();
  if (board.startSquare === null || board.goalSquare === null) {
    throw new Error();
  }
  openList.put({
    square: board.startSquare,
    fscore: distance(board.startSquare.getPos(), board.goalSquare.getPos()),
    from: null,
  });
  const fscores: number[][] = initializeScores(board, () => Infinity);
  const hscores: number[][] = initializeScores(board, (sq) =>
    distance(sq.getPos(), (board.goalSquare as Square).getPos())
  );
  const gscores: number[][] = initializeScores(board, () => Infinity);
  fscores[board.startSquare.row][board.startSquare.col] =
    hscores[board.startSquare.row][board.startSquare.col];
  gscores[board.startSquare.row][board.startSquare.col] = 0;
  while (!openList.isEmpty()) {
    openList.sort();
    const current = openList.pop();
    const currSquare = current.square;
    if (currSquare === board.goalSquare) {
      await backtrack(board, current);
      return true;
    }
    exploreNeighbors(fscores, gscores, hscores, current, board, openList);
    await wait(config.ANIM_WAIT_TIME);
  }
  return false;
};

const exploreNeighbors = (
  fscores: number[][],
  gscores: number[][],
  hscores: number[][],
  current: ListEntry,
  board: Board,
  openList: PathfindingList
) => {
  const currSquare = current.square;
  const gscore_neighbors = gscores[currSquare.row][currSquare.col] + 1;
  for (const neighbor of currSquare.neighbors) {
    if (gscore_neighbors < gscores[neighbor.row][neighbor.col]) {
      gscores[neighbor.row][neighbor.col] = gscore_neighbors;
      const fscoreNew = gscore_neighbors + hscores[neighbor.row][neighbor.col];
      fscores[neighbor.row][neighbor.col] = fscoreNew;
      if (neighbor !== board.startSquare && neighbor !== board.goalSquare) {
        neighbor.makeVisited();
      }
      openList.put({
        from: current,
        square: neighbor,
        fscore: fscoreNew,
      });
    }
  }
};

export default astar;
