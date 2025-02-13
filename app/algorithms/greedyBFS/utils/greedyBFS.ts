// utils/greedybfs.ts
import { INode } from "@/app/interfaces/interfaces";
import { getUnvisitedNeighbors } from "../../utils/utils";

const sortNodesByHCost = (unvisitedNodes: INode[]) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.hCost! - nodeB.hCost!);
};

export const greedyBFS = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const visitedNodesInOrder: INode[] = [];
  const unvisitedNodes: INode[] = [];

  // Initialize hCost and reset node states
  for (const row of grid) {
    for (const node of row) {
      node.hCost = Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
      node.isVisited = false;
      node.previousNode = null;
    }
  }

  startNode.isVisited = true;
  unvisitedNodes.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (unvisitedNodes.length > 0) {
    sortNodesByHCost(unvisitedNodes);
    const currentNode = unvisitedNodes.shift()!;

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        visitedNodesInOrder.push(neighbor);
        unvisitedNodes.push(neighbor);

        if (neighbor === finishNode) return visitedNodesInOrder;
      }
    }
  }

  return visitedNodesInOrder;
};