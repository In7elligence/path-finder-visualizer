import React from "react";
import { GridAction } from "./gridReducer";
import { visualizeDijkstras } from "@/app/algorithms/dijkstras/animation/visualizeDijkstras";
import { visualizeAstar } from "@/app/algorithms/astar/animation/visualizeAstar";
import { visualizeGreedyBFS } from "@/app/algorithms/greedyBFS/animation/visualizeGreedyBFS";
import { visualizeBFS } from "@/app/algorithms/bfs/animation/visualizeBFS";
import { visualizeDFS } from "@/app/algorithms/dfs/animation/visualizeDFS";
import { IGridState } from "@/app/interfaces/interfaces";
import { removeWallsFromGrid } from "@/app/algorithms/utils/utils";
import { AvailableMazes } from "@/app/types/types";
import { visualizeRandomBasicMaze } from "@/app/algorithms/mazes/animations/randomBasicMaze";
import { visualizeRecursiveDivision } from "@/app/algorithms/mazes/animations/recursiveDivisionMaze";

export const createNode = (state: IGridState, col: number, row: number) => {
  const { startNode, finishNode } = state;
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isMazeWall: false,
    previousNode: null,
  };
};

// Position start and end nodes dynamically
export const positionStartAndEndNodes = (
  rows: number,
  cols: number,
  dispatch: React.Dispatch<GridAction>
) => {
  const startRow = Math.floor(rows / 2); // Center row
  const startCol = 2; // 2 columns from the left
  const finishRow = Math.floor(rows / 2); // Center row
  const finishCol = cols - 3; // 2 columns from the right

  dispatch({
    type: "SET_START_NODE",
    payload: { row: startRow, col: startCol },
  });
  dispatch({
    type: "SET_FINISH_NODE",
    payload: { row: finishRow, col: finishCol },
  });
};

export const dropNode = (
  state: IGridState,
  row: number,
  col: number,
  isStart: boolean,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode } = state;

  // Ensure the drop target is not a wall
  if (grid[row][col].isWall) return;

  // Ensure the start and finish nodes are not the same
  if (isStart && row === finishNode.row && col === finishNode.col) return;
  if (!isStart && row === startNode.row && col === startNode.col) return;

  // Create a new grid with the updated start/finish node positions
  const newGrid = grid.map((rowNodes, rowIdx) =>
    rowNodes.map((node, colIdx) => {
      // Reset the original start/finish node position
      if (node.isStart && isStart) {
        return { ...node, isStart: false };
      }
      if (node.isFinish && !isStart) {
        return { ...node, isFinish: false };
      }

      // Set the new start/finish node position
      if (rowIdx === row && colIdx === col) {
        return {
          ...node,
          isStart: isStart,
          isFinish: !isStart,
        };
      }

      // Preserve the other node (start or finish)
      if (node.isStart && !isStart) {
        return { ...node, isStart: true, isFinish: false };
      }
      if (node.isFinish && isStart) {
        return { ...node, isStart: false, isFinish: true };
      }

      return node;
    })
  );

  dispatch({ type: "SET_GRID", payload: newGrid });

  if (isStart) {
    dispatch({ type: "SET_START_NODE", payload: { row, col } });
  } else {
    dispatch({ type: "SET_FINISH_NODE", payload: { row, col } });
  }
};

export const visualizeAlgorithm = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { selectedAlgorithm } = state;

  switch (selectedAlgorithm) {
    case "dijkstras":
      visualizeDijkstras(state, dispatch);
      break;
    case "astar":
      visualizeAstar(state, dispatch);
      break;
    case "greedyBFS":
      visualizeGreedyBFS(state, dispatch);
      break;
    case "bfs":
      visualizeBFS(state, dispatch);
      break;
    case "dfs":
      visualizeDFS(state, dispatch);
      break;
    default:
      visualizeDijkstras(state, dispatch);
  }
};

export const generateMaze = (
  state: IGridState,
  maze: AvailableMazes,
  dispatch: React.Dispatch<GridAction>
) => {
  switch (maze) {
    case "randomBasicMaze":
      visualizeRandomBasicMaze(state, dispatch);
      break;
    case "recursiveDivision":
      visualizeRecursiveDivision(state, dispatch);
      break;
    case "recursiveDivisionVerticalSkew":
      visualizeRecursiveDivision(state, dispatch, "vertical");
      break;
    case "recursiveDivisionHorizontalSkew":
      visualizeRecursiveDivision(state, dispatch, "horizontal");
      break;
    default:
      visualizeRecursiveDivision(state, dispatch);
  }
};

export const clearWalls = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid } = state;

  const newGrid = removeWallsFromGrid(grid);

  dispatch({ type: "SET_GRID", payload: newGrid });
};

export const clearPath = (dispatch: React.Dispatch<GridAction>) => {
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_NODES", payload: [] });
};
