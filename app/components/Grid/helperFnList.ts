import React from "react";
import { GridAction } from "./gridReducer";
import { visualizeDijkstras } from "@/app/algorithms/dijkstras/animation/visualizeDijkstras";
import { visualizeAstar } from "@/app/algorithms/astar/animation/visualizeAstar";
import { visualizeGreedyBFS } from "@/app/algorithms/greedyBFS/animation/visualizeGreedyBFS";
import { visualizeBFS } from "@/app/algorithms/bfs/animation/visualizeBFS";
import { visualizeDFS } from "@/app/algorithms/dfs/animation/visualizeDFS";
import { IGridState, INode } from "@/app/interfaces/interfaces";
import { removeWallsFromGrid } from "@/app/algorithms/utils/utils";
import { AvailableMazes } from "@/app/types/types";
import { visualizeRandomBasicMaze } from "@/app/algorithms/mazes/animations/randomBasicMaze";
import { visualizeRecursiveDivision } from "@/app/algorithms/mazes/animations/recursiveDivisionMaze";

export const createNode = (state: IGridState, col: number, row: number): INode => {
  const { startNode, finishNode, bombNode } = state;
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    isBomb: row === bombNode.row && col === bombNode.col,
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

export const placeBombNode = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode } = state;
  const validNodes: { row: number; col: number }[] = [];
  const minDistance = 5; // Minimum distance from start/finish

  // Find all valid nodes
  grid.forEach((row, rowIdx) => {
    row.forEach((node, colIdx) => {
      const isStart = rowIdx === startNode.row && colIdx === startNode.col;
      const isFinish = rowIdx === finishNode.row && colIdx === finishNode.col;
      const distanceFromStart =
        Math.abs(rowIdx - startNode.row) + Math.abs(colIdx - startNode.col);
      const distanceFromFinish =
        Math.abs(rowIdx - finishNode.row) + Math.abs(colIdx - finishNode.col);

      if (
        !node.isWall &&
        !isStart &&
        !isFinish &&
        distanceFromStart >= minDistance &&
        distanceFromFinish >= minDistance
      ) {
        validNodes.push({ row: rowIdx, col: colIdx });
      }
    });
  });

  if (validNodes.length > 0) {
    const randomIndex = Math.floor(Math.random() * validNodes.length);
    dispatch({ type: "SET_BOMB_NODE", payload: validNodes[randomIndex] });
  }
};

export const placeRandomBomb = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode } = state;
  const validNodes = grid
    .flat()
    .filter(
      (node) =>
        !node.isWall &&
        !node.isStart &&
        !node.isFinish &&
        Math.abs(node.row - startNode.row) +
          Math.abs(node.col - startNode.col) >
          5 &&
        Math.abs(node.row - finishNode.row) +
          Math.abs(node.col - finishNode.col) >
          5
    );

  if (validNodes.length > 0) {
    const randomNode =
      validNodes[Math.floor(Math.random() * validNodes.length)];
    dropSpecialNode(state, randomNode.row, randomNode.col, "bomb", dispatch);
  }
};

export const dropSpecialNode = (
  state: IGridState,
  row: number,
  col: number,
  nodeType: "start" | "finish" | "bomb",
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode, bombNode } = state;

  // Prevent placement on walls
  if (grid[row][col].isWall) return;

  // Prevent overlaps
  switch (nodeType) {
    case "start":
      if (row === finishNode.row && col === finishNode.col) return;
      if (row === bombNode.row && col === bombNode.col) return;
      break;
    case "finish":
      if (row === startNode.row && col === startNode.col) return;
      if (row === bombNode.row && col === bombNode.col) return;
      break;
    case "bomb":
      if (row === startNode.row && col === startNode.col) return;
      if (row === finishNode.row && col === finishNode.col) return;
      break;
  }

  // Create new grid with updated positions
  const newGrid = grid.map((rowNodes, rowIdx) =>
    rowNodes.map((node, colIdx) => ({
      ...node,
      isStart:
        nodeType === "start" ? rowIdx === row && colIdx === col : node.isStart,
      isFinish:
        nodeType === "finish"
          ? rowIdx === row && colIdx === col
          : node.isFinish,
      isBomb:
        nodeType === "bomb" ? rowIdx === row && colIdx === col : node.isBomb,
    }))
  );

  dispatch({ type: "SET_GRID", payload: newGrid });

  // Update specific node position in state
  switch (nodeType) {
    case "start":
      dispatch({ type: "SET_START_NODE", payload: { row, col } });
      break;
    case "finish":
      dispatch({ type: "SET_FINISH_NODE", payload: { row, col } });
      break;
    case "bomb":
      dispatch({ type: "SET_BOMB_NODE", payload: { row, col } });
      break;
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

export const removeBomb = (state: IGridState, dispatch: React.Dispatch<GridAction>) => {
  const { grid } = state;

  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isBomb: false
    }))
  );
  
  dispatch({ type: "SET_GRID", payload: newGrid});
  dispatch({ type: "SET_BOMB_NODE", payload: { row: -1, col: -1 } });
}

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
