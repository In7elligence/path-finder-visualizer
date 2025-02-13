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
  grid.forEach(row => row.forEach(node => {
    node.isVisited = false;
    node.previousNode = null;
  }));

  startNode.isVisited = true;
  stack.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (currentNode === finishNode) return visitedNodesInOrder;
    
    if (currentNode.isWall) continue;

    const neighbors = getUnvisitedNeighbors(currentNode, grid).reverse(); // Reverse for DFS order
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        visitedNodesInOrder.push(neighbor);
        stack.push(neighbor);
        
        if (neighbor === finishNode) return visitedNodesInOrder;
      }
    }
  }
  
  return visitedNodesInOrder;
};