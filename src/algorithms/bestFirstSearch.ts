import Board from "../Board";
import { PathfindingList } from "../utils/PathfindingList";
import { distance, initializeScores, wait } from "../utils/index";
import { Square } from "../Square";
import { backtrack } from "./astar";
import config from "../config";

const bestFirstSearch = async function (board: Board): Promise<void> {
  if (board.startSquare === null || board.goalSquare === null) {
    return;
  }
  const openList = new PathfindingList();
  openList.put({
    from: null,
    fscore: distance(board.startSquare.getPos(), board.goalSquare.getPos()),
    square: board.startSquare,
  });
  const fscores = initializeScores(board, (sq) =>
    distance((board.goalSquare as Square).getPos(), sq.getPos())
  );
  const visited: Square[] = [];
  while (!openList.isEmpty()) {
    openList.sort();
    const current = openList.pop();
    const currSquare = current.square;
    if (currSquare === board.goalSquare) {
      await backtrack(board, current);
      alert("solve");
      return;
    }
    for (const neighbor of currSquare.neighbors) {
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        if (!neighbor.isGoal() && !neighbor.isStart()) {
          neighbor.makeVisited();
        }
        openList.put({
          square: neighbor,
          from: current,
          fscore: fscores[neighbor.row][neighbor.col],
        });
      }
    }
    await wait(config.ANIM_WAIT_TIME);
  }
  alert("this is unsolvable");
};

export default bestFirstSearch;
