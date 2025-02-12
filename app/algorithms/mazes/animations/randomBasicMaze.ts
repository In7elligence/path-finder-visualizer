import { GridAction } from "@/app/components/Grid/gridReducer";
import { IGridState, INode } from "@/app/interfaces/interfaces";
import { ensureSolvability } from "../utils/utils";
import { animateRandomBasicMaze } from "@/app/utils/utils";
import { removeWallsFromGrid } from "../../utils/utils";


export const visualizeRandomBasicMaze = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode, animationDuration, isAlgoRunning } =
    state;

  if (isAlgoRunning) return;

  const newGrid = removeWallsFromGrid(grid);

  dispatch({ type: "SET_GRID", payload: newGrid });
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_NODES", payload: [] });
  dispatch({ type: "TOGGLE_ALGO", payload: true });

  const start = newGrid[startNode.row][startNode.col];
  const finish = newGrid[finishNode.row][finishNode.col];
  const walls: INode[] = [];

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (
        Math.random() < 0.3 &&
        !newGrid[row][col].isStart &&
        !newGrid[row][col].isFinish &&
        !newGrid[row][col].isWall &&
        !newGrid[row][col].isMazeWall
      ) {
        walls.push(newGrid[row][col]);
      }
    }
  }

  ensureSolvability(newGrid, start, finish, walls);
  animateRandomBasicMaze(newGrid, walls, animationDuration, dispatch);
};
