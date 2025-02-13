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
  grid.forEach(row => row.forEach(node => {
    node.isVisited = false;
    node.previousNode = null;
  }));

  startNode.isVisited = true;
  queue.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    if (currentNode === finishNode) return visitedNodesInOrder;
    
    if (currentNode.isWall) continue;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        visitedNodesInOrder.push(neighbor);
        queue.push(neighbor);
        
        if (neighbor === finishNode) return visitedNodesInOrder;
      }
    }
  }
  
  return visitedNodesInOrder;
};