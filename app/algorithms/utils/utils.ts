import { INode } from "@/app/interfaces/interfaces";
import { NodeDirection } from "@/app/types/types";

export const resetGridForAlgorithm = (grid: INode[][]): INode[][] => {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      isBlueVisited: false,
      isPurpleVisited: false,
      distance: Infinity,
      isPath: false,
      gCost: Infinity,
      hCost: Infinity,
      fCost: Infinity,
      direction: undefined,
      previousNode: null,
      isStart: node.isStart,
      isFinish: node.isFinish,
      isBomb: node.isBomb,
    }))
  );
};

export const removeWallsFromGrid = (grid: INode[][]) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      isMazeWall: false,
      isVisited: false,
      distance: Infinity,
      previousNode: null,
      gCost: Infinity, // Reset for A*
      hCost: Infinity, // Reset for A*
      fCost: Infinity, // Reset for A*
    }))
  );
  return newGrid;
};

export const getDirection = (from: INode, to: INode): NodeDirection => {
  if (to.row < from.row) return "up";
  if (to.row > from.row) return "down";
  if (to.col < from.col) return "left";
  return "right";
};
