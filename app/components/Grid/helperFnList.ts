import React from "react";
import { GridAction } from "./gridReducer";
import { IGridState, INode } from "@/app/interfaces/interfaces";

export const createNode = (
  state: IGridState,
  col: number,
  row: number,
): INode => {
  const { startNode, finishNode } = state;
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    isBomb: false,
    distance: Infinity,
    isBlueVisited: false,
    isPurpleVisited: false,
    isWall: false,
    isMazeWall: false,
    previousNode: null,
    weight: 1,
  };
};

// Position start and end nodes dynamically
export const positionStartAndEndNodes = (
  rows: number,
  cols: number,
  dispatch: React.Dispatch<GridAction>,
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
  dispatch: React.Dispatch<GridAction>,
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

export const dropSpecialNode = (
  state: IGridState,
  row: number,
  col: number,
  nodeType: "start" | "finish" | "bomb",
  dispatch: React.Dispatch<GridAction>,
) => {
  const { grid, startNode, finishNode, bombNode, selectedAlgorithm } = state;

  // Prevent placement on walls
  if (grid[row][col].isWall) return;

  // Prevent overlaps
  switch (nodeType) {
    case "start":
      if (row === finishNode.row && col === finishNode.col) return;
      if (row === bombNode.row && col === bombNode.col) return;
      if (grid[row][col].weight > 1) return; // preserve weighted nodes
      break;
    case "finish":
      if (row === startNode.row && col === startNode.col) return;
      if (row === bombNode.row && col === bombNode.col) return;
      if (grid[row][col].weight > 1) return; // preserve weighted nodes
      break;
    case "bomb":
      if (row === startNode.row && col === startNode.col) return;
      if (row === finishNode.row && col === finishNode.col) return;
      if (grid[row][col].weight > 1) return; // preserve weighted nodes
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
    })),
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
      // No bomb during Bidrectional Swarm Algorithm
      if (selectedAlgorithm === "swarmBidirectional") return;

      dispatch({ type: "SET_BOMB_NODE", payload: { row, col } });
      dispatch({ type: "SET_BOMB_DEFUSE_STATE", payload: false });
      break;
  }
};
