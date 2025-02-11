import { INode } from "../../../interfaces/interfaces";

const getAllNodes = (grid: INode[][]) => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

// Calculate the Manhattan distance heuristic
const getManhattanDistance = (nodeA: INode, nodeB: INode) => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

// total cost (f = g + h)
const sortNodesByTotalCost = (unvisitedNodes: INode[]) => {
  unvisitedNodes.sort(
    (nodeA, nodeB) => (nodeA.fCost || 0) - (nodeB.fCost || 0)
  );
};

const getUnvisitedNeighbors = (node: INode, grid: INode[][]) => {
  const neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

// Update unvisited neighbors with new g, h, and f costs
const updateUnvisitedNeighbors = (
  node: INode,
  grid: INode[][],
  finishNode: INode
) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  for (const neighbor of unvisitedNeighbors) {
    const gCost = (node.gCost || 0) + 1; // Each step has a cost of 1
    const hCost = getManhattanDistance(neighbor, finishNode);
    const fCost = gCost + hCost;

    // If this path to the neighbor is better, update the neighbor
    if (fCost < (neighbor.fCost || 0)) {
      neighbor.gCost = gCost;
      neighbor.hCost = hCost;
      neighbor.fCost = fCost;
      neighbor.previousNode = node;
    }
  }
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
  const visitedNodesInOrder: INode[] = [];

  // Initialize costs for all nodes
  for (const row of grid) {
    for (const node of row) {
      node.gCost = Infinity;
      node.hCost = Infinity;
      node.fCost = Infinity;
    }
  }

  // Initialize costs for the start node
  startNode.gCost = 0;
  startNode.hCost = getManhattanDistance(startNode, finishNode);
  startNode.fCost = startNode.gCost + startNode.hCost;

  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    sortNodesByTotalCost(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If the closest node is a wall or unreachable, skip it
    if (closestNode?.isWall) continue;
    if (closestNode?.fCost === Infinity) return visitedNodesInOrder;

    if (closestNode) {
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
    }

    if (closestNode === finishNode) return visitedNodesInOrder;

    if (closestNode) updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }

  return visitedNodesInOrder;
};
