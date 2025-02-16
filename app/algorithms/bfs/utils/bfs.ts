import { INode } from "@/app/interfaces/interfaces";
import { getUnvisitedNeighbors } from "../../utils/utils";

export const bfs = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const visitedNodesInOrder: INode[] = [];
  const queue: INode[] = [];

  // Reset node states
  grid.forEach((row) =>
    row.forEach((node) => {
      if (finishNode.isBomb) {
        node.isPurpleVisited = false;
      } else {
        node.isBlueVisited = false;
      }

      node.previousNode = null;
    })
  );

  if (finishNode.isBomb) {
    startNode.isPurpleVisited = true;
  } else {
    startNode.isBlueVisited = true;
  }

  queue.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    if (currentNode === finishNode) return visitedNodesInOrder;

    if (currentNode.isWall) continue;

    const neighbors = getUnvisitedNeighbors(currentNode, grid, finishNode.isBomb);
    for (const neighbor of neighbors) {
      if (finishNode.isBomb) {
        if (!neighbor.isPurpleVisited && !neighbor.isWall) {
          neighbor.isPurpleVisited = true;
          neighbor.previousNode = currentNode;
          visitedNodesInOrder.push(neighbor);
          queue.push(neighbor);

          if (neighbor === finishNode) return visitedNodesInOrder;
        }
      } else {
        if (!neighbor.isBlueVisited && !neighbor.isWall) {
          neighbor.isBlueVisited = true;
          neighbor.previousNode = currentNode;
          visitedNodesInOrder.push(neighbor);
          queue.push(neighbor);

          if (neighbor === finishNode) return visitedNodesInOrder;
        }
      }
    }
  }

  return visitedNodesInOrder;
};
