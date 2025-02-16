import { INode } from "../../../interfaces/interfaces";

class PriorityQueue {
  private elements: INode[] = [];

  enqueue(node: INode) {
    this.elements.push(node);
    this.elements.sort((a, b) => a.fCost! - b.fCost!);
  }

  dequeue(): INode | undefined {
    return this.elements.shift();
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  contains(node: INode): boolean {
    return this.elements.some((n) => n.row === node.row && n.col === node.col);
  }
}

// Calculate the Manhattan distance heuristic
const getManhattanDistance = (nodeA: INode, nodeB: INode) => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

const getUnvisitedNeighbors = (node: INode, grid: INode[][]) => {
  const neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

/*!
 * Performs A* algorithm.
 * Returns all nodes in the order they were visited.
 * Also makes nodes point back to their previous node, allowing us to compute the shortest path.
!*/
export const astar = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const openSet = new PriorityQueue();
  const closedSet = new Set<string>();
  const visitedNodesInOrder: INode[] = [];

  // Initialize grid
  grid.forEach((row) =>
    row.forEach((node) => {
      node.gCost = Infinity;
      node.hCost = Infinity;
      node.fCost = Infinity;
      node.previousNode = null;
    })
  );

  startNode.gCost = 0;
  startNode.hCost = getManhattanDistance(startNode, finishNode);
  startNode.fCost = startNode.hCost;
  openSet.enqueue(startNode);

  while (!openSet.isEmpty()) {
    const currentNode = openSet.dequeue();
    if (!currentNode) break;

    // Add to closed set early to prevent reprocessing
    closedSet.add(`${currentNode.row},${currentNode.col}`);
    visitedNodesInOrder.push(currentNode);

    // Early exit when reaching finish
    if (currentNode === finishNode) break;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (neighbor.isWall || closedSet.has(`${neighbor.row},${neighbor.col}`)) {
        continue;
      }

      const tentativeGCost = currentNode.gCost! + 1;

      if (tentativeGCost < neighbor.gCost!) {
        neighbor.previousNode = currentNode;
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = getManhattanDistance(neighbor, finishNode);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;

        if (!openSet.contains(neighbor)) {
          openSet.enqueue(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
};
