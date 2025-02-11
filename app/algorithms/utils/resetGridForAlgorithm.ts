import { INode } from "@/app/interfaces/interfaces";

export const resetGridForAlgorithm = (grid: INode[][]) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
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
