import { INode } from "@/app/interfaces/interfaces";

const getDFSneighbors = (
  node: INode,
  grid: INode[][],
  isBombPhase: boolean,
): INode[] => {
  const neighbors: INode[] = [];
  const { row, col } = node;

  // Check neighbors in reverse order (right, left, down, up) to maintain correct DFS order
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up

  return neighbors.filter(
    (neighbor) =>
      !neighbor.isWall &&
      (isBombPhase ? !neighbor.isPurpleVisited : !neighbor.isBlueVisited),
  );
};

export const dfs = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode,
): INode[] => {
  const isBombPhase = finishNode.isBomb;
  const visitedNodesInOrder: INode[] = [];
  const stack: INode[] = [];

  // Fast grid reset using matrix coordinates
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const node = grid[row][col];
      node.previousNode = null;

      if (isBombPhase) {
        node.isPurpleVisited = false;
      } else {
        node.isBlueVisited = false;
      }
    }
  }

  // Initialize starting node
  if (isBombPhase) {
    startNode.isPurpleVisited = true;
  } else {
    startNode.isBlueVisited = true;
  }

  stack.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop()!;

    // Early exit if we find the finish node
    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getDFSneighbors(currentNode, grid, isBombPhase);

    for (const neighbor of neighbors) {
      // Mark visited immediately to prevent duplicates
      if (isBombPhase) {
        neighbor.isPurpleVisited = true;
      } else {
        neighbor.isBlueVisited = true;
      }

      neighbor.previousNode = currentNode;
      visitedNodesInOrder.push(neighbor);
      stack.push(neighbor);

      // Early exit when pushing to stack
      if (neighbor === finishNode) return visitedNodesInOrder;
    }
  }

  return visitedNodesInOrder;
};
