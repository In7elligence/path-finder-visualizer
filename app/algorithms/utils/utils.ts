import { INode } from "@/app/interfaces/interfaces";

export const getUnvisitedNeighbors = (node: INode, grid: INode[][]) => {
  const neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

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
