import { PathfindingList } from "../utils/PathfindingList";
import { initializeScores, wait } from "../utils/index";
import Board from "../Board";
import config from "../config";
import { backtrack } from "./astar";

const dijkstra = async function (board: Board): Promise<boolean> {
  if (board.startSquare === null || board.goalSquare === null) {
    throw new Error();
  }
  const openList = new PathfindingList();
  const fscores = initializeScores(board, () => Infinity);
  fscores[board.startSquare.row][board.startSquare.col] = 0;
  openList.put({ from: null, square: board.startSquare, fscore: 0 });
  while (!openList.isEmpty()) {
    openList.sort();
    const current = openList.pop();
    const currentSquare = current.square;
    if (currentSquare === board.goalSquare) {
      await backtrack(board, current);
      return true;
    }
    const newScore = current.fscore + 1;
    for (const neighbor of currentSquare.neighbors) {
      if (newScore < fscores[neighbor.row][neighbor.col]) {
        if (!neighbor.isGoal() && !neighbor.isStart()) {
          neighbor.makeVisited();
        }
        fscores[neighbor.row][neighbor.col] = newScore;
        openList.put({
          fscore: newScore,
          from: current,
          square: neighbor,
        });
      }
    }
    await wait(config.ANIM_WAIT_TIME);
  }
  return false;
};

export default dijkstra;
