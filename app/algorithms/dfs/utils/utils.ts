import { INode } from "@/app/interfaces/interfaces";
import { getUnvisitedNeighbors } from "../../utils/utils";

export const dfs = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const visitedNodesInOrder: INode[] = [];
  const stack: INode[] = [];

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

  stack.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop()!;

    if (currentNode === finishNode) return visitedNodesInOrder;

    if (currentNode.isWall) continue;

    const neighbors = getUnvisitedNeighbors(
      currentNode,
      grid,
      finishNode.isBomb
    ).reverse(); // Reverse for DFS order
    for (const neighbor of neighbors) {
      if (finishNode.isBomb) {
        if (!neighbor.isBlueVisited && !neighbor.isWall) {
          neighbor.isBlueVisited = true;
          neighbor.previousNode = currentNode;
          visitedNodesInOrder.push(neighbor);
          stack.push(neighbor);

          if (neighbor === finishNode) return visitedNodesInOrder;
        }
      } else {
        if (!neighbor.isBlueVisited && !neighbor.isWall) {
          neighbor.isBlueVisited = true;
          neighbor.previousNode = currentNode;
          visitedNodesInOrder.push(neighbor);
          stack.push(neighbor);

          if (neighbor === finishNode) return visitedNodesInOrder;
        }
      }
    }
  }

  return visitedNodesInOrder;
};
