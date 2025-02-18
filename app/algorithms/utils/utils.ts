import { INode } from "@/app/interfaces/interfaces";

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
      weight: node.weight,
      isStart: node.isStart,
      isFinish: node.isFinish,
      isBomb: node.isBomb,
    }))
  );
};

export const removeWallsAndWeightsFromGrid = (grid: INode[][]) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      isMazeWall: false,
      isVisited: false,
      distance: Infinity,
      previousNode: null,
      weight: 1,
      gCost: Infinity, // Reset for A*
      hCost: Infinity, // Reset for A*
      fCost: Infinity, // Reset for A*
    }))
  );
  return newGrid;
};
