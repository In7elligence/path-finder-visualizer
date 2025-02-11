/*!
 * Performs Dijkstra's algorithm.
 * Returns all nodes in the order in which they were visited.
 * Also makes nodes point back to their previous node,
 * effectively allowing us to compute the shortest path.
!*/

import { INode } from "@/app/interfaces/interfaces";

const getAllNodes = (grid: INode[][]) => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const sortNodesByDistance = (unvisitedNodes: INode[]) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

// by backtracking from the finish node.
export const dijkstra = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const visitedNodesInOrder: INode[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If the closest node is a wall or unreachable, skip it
    if (closestNode?.isWall) continue;
    if (closestNode?.distance === Infinity) return visitedNodesInOrder;

    if (closestNode) {
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
    }

    if (closestNode === finishNode) return visitedNodesInOrder;

    if (closestNode) updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
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

const updateUnvisitedNeighbors = (node: INode, grid: INode[][]) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};
