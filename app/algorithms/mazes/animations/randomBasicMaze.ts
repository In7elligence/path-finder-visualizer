import { GridAction } from "@/app/components/Grid/gridReducer";
import { IGridState, INode } from "@/app/interfaces/interfaces";
import { ensureSolvability } from "../utils/utils";
import { removeWallsAndWeightsFromGrid } from "../../utils/utils";

const animateRandomBasicMaze = (
  initialGrid: INode[][],
  walls: INode[],
  animationDuration: number,
  dispatch: React.Dispatch<GridAction>,
) => {
  const gridWithWalls = initialGrid.map((row) =>
    row.map((node) => {
      const isWall = walls.some(
        (w) => w.row === node.row && w.col === node.col,
      );
      return {
        ...node,
        isWall: isWall || node.isWall,
        isMazeWall: isWall || node.isMazeWall,
      };
    }),
  );

  dispatch({ type: "SET_GRID", payload: gridWithWalls });

  setTimeout(() => {
    dispatch({ type: "TOGGLE_ALGO", payload: false });
  }, animationDuration);
};

export const visualizeRandomBasicMaze = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>,
) => {
  const {
    grid,
    startNode,
    finishNode,
    bombNode: initBombNode,
    visitedNodeAnimationDuration,
    isAlgoRunning,
  } = state;

  if (isAlgoRunning) return;

  const newGrid = removeWallsAndWeightsFromGrid(grid);

  dispatch({ type: "SET_GRID", payload: newGrid });
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_PURPLE_NODES", payload: [] });
  dispatch({ type: "SET_VISITED_BLUE_NODES", payload: [] });
  dispatch({ type: "TOGGLE_ALGO", payload: true });

  let bomb = undefined;

  if (initBombNode.row !== -1 && initBombNode.col !== -1) {
    bomb = newGrid[initBombNode.row][initBombNode.col];
  }

  const start = newGrid[startNode.row][startNode.col];
  const finish = newGrid[finishNode.row][finishNode.col];
  const walls: INode[] = [];

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (
        Math.random() < 0.3 &&
        !newGrid[row][col].isStart &&
        !newGrid[row][col].isFinish &&
        !newGrid[row][col].isBomb &&
        !newGrid[row][col].isWall &&
        !newGrid[row][col].isMazeWall
      ) {
        walls.push(newGrid[row][col]);
      }
    }
  }

  ensureSolvability(newGrid, start, finish, walls, bomb);
  animateRandomBasicMaze(
    newGrid,
    walls,
    visitedNodeAnimationDuration,
    dispatch,
  );
};
