import { INode } from "@/app/interfaces/interfaces";

const getNeighbors = (node: INode, grid: INode[][]): INode[] => {
  const neighbors: INode[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

export const bellmanFord = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode,
): INode[] => {
  // Initialize grid
  grid.forEach((row) =>
    row.forEach((node) => {
      node.distance = Infinity;
      node.previousNode = null;
      node.isBlueVisited = false;
      node.isPurpleVisited = false;
    }),
  );

  startNode.distance = 0;
  const visitedNodesInOrder: INode[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Main Bellman-Ford loop
  for (let i = 0; i < rows * cols - 1; i++) {
    let updatesMade = false;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currentNode = grid[row][col];

        if (currentNode.distance === Infinity || currentNode.isWall) continue;

        const neighbors = getNeighbors(currentNode, grid);

        for (const neighbor of neighbors) {
          if (neighbor.isWall) continue;

          const tentativeDistance = currentNode.distance + neighbor.weight;

          if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance;
            neighbor.previousNode = currentNode;
            updatesMade = true;

            if (!visitedNodesInOrder.includes(neighbor)) {
              visitedNodesInOrder.push(neighbor);
            }
          }
        }
      }
    }

    if (!updatesMade) break;
  }

  // If the target is unreachable, return all reachable visited nodes.
  const targetIndex = visitedNodesInOrder.indexOf(finishNode);

  if (targetIndex === -1) {
    visitedNodesInOrder.forEach((node) => {
      if (finishNode.isBomb) {
        node.isPurpleVisited = true;
      } else {
        node.isBlueVisited = true;
      }
    });

    return visitedNodesInOrder;
  }

  // Reconstruct the final shortest path.
  const shortestPath: INode[] = [];
  let currentNode: INode | null = finishNode;

  while (currentNode && currentNode !== startNode) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  // Keep the nodes discovered before the target, but avoid
  // duplicating nodes that are already part of the shortest path.
  const shortestPathSet = new Set(shortestPath);

  const nodesBeforeTarget = visitedNodesInOrder
    .slice(0, targetIndex)
    .filter((node) => !shortestPathSet.has(node));

  // All shortest-path nodes must be visually visited before
  // the target, even if Bellman-Ford discovered them later.
  const nodesToVisualize = [...nodesBeforeTarget, ...shortestPath];

  // Mark visitation based on phase.
  nodesToVisualize.forEach((node) => {
    if (finishNode.isBomb) {
      node.isPurpleVisited = true;
    } else {
      node.isBlueVisited = true;
    }
  });

  return nodesToVisualize;
};
