import { GridAction } from "@/app/components/Grid/gridReducer";
import { IGridState } from "@/app/interfaces/interfaces";
import { recursiveDivisionMaze } from "../utils/recursiveDivision";
import { removeWallsAndWeightsFromGrid } from "../../utils/utils";
import { RecursiveDivisions } from "@/app/types/types";
import { animationManager } from "../../AnimationManager/AnimationManager";
import { animateMaze } from "@/app/utils/utils";

export const visualizeRecursiveDivision = async (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>,
  orientation?: RecursiveDivisions,
) => {
  const {
    grid,
    startNode,
    finishNode,
    bombNode: initBombNode,
    gridDimensions,
    isAlgoRunning,
    mazeAnimationDuration,
  } = state;

  const { rows, cols } = gridDimensions;

  if (isAlgoRunning) return;

  animationManager.clearAllTimeouts();

  const newGrid = removeWallsAndWeightsFromGrid(grid);

  let bombNode = undefined;

  if (initBombNode.row !== -1 && initBombNode.col !== -1) {
    bombNode = newGrid[initBombNode.row][initBombNode.col];
  }

  const walls = recursiveDivisionMaze({
    grid: newGrid,
    startNode: newGrid[startNode.row][startNode.col],
    finishNode: newGrid[finishNode.row][finishNode.col],
    bombNode: bombNode,
    rowStart: 1,
    rowEnd: rows - 2,
    colStart: 1,
    colEnd: cols - 2,
    orientation: orientation || Math.random() > 0.5 ? "horizontal" : "vertical",
    walls: [],
    surroundingWalls: false,
  });

  // Protect all corner cases
  const lastRow = rows - 1;
  const lastCol = cols - 1;
  const corners = [
    {
      // Top-left
      position: { row: 0, col: 0 },
      adjacent: [
        { row: 0, col: 1 }, // Right
        { row: 1, col: 0 }, // Down
        { row: 1, col: 1 }, // Diagonal
      ],
    },
    {
      // Top-right
      position: { row: 0, col: lastCol },
      adjacent: [
        { row: 0, col: lastCol - 1 }, // Left
        { row: 1, col: lastCol }, // Down
        { row: 1, col: lastCol - 1 }, // Diagonal
      ],
    },
    {
      // Bottom-left
      position: { row: lastRow, col: 0 },
      adjacent: [
        { row: lastRow, col: 1 }, // Right
        { row: lastRow - 1, col: 0 }, // Up
        { row: lastRow - 1, col: 1 }, // Diagonal
      ],
    },
    {
      // Bottom-right
      position: { row: lastRow, col: lastCol },
      adjacent: [
        { row: lastRow, col: lastCol - 1 }, // Left
        { row: lastRow - 1, col: lastCol }, // Up
        { row: lastRow - 1, col: lastCol - 1 }, // Diagonal
      ],
    },
  ];

  // Check start, finish and bomb nodes
  [startNode, finishNode, bombNode].forEach((node) => {
    const corner = corners.find(
      (c) => c.position.row === node?.row && c.position.col === node.col,
    );

    if (corner) {
      corner.adjacent.forEach((pos) => {
        if (pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols) {
          // Remove from walls array
          const wallIndex = walls.findIndex(
            (w) => w.row === pos.row && w.col === pos.col,
          );
          if (wallIndex > -1) walls.splice(wallIndex, 1);

          // Clear in grid
          newGrid[pos.row][pos.col].isWall = false;
          newGrid[pos.row][pos.col].isMazeWall = false;
        }
      });
    }
  });

  await animateMaze(newGrid, walls, mazeAnimationDuration, dispatch);

  dispatch({ type: "TOGGLE_ALGO", payload: false });
};
