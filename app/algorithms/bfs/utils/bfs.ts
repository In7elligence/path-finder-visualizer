import { INode } from "@/app/interfaces/interfaces";

class EfficientQueue<T> {
  private elements: T[] = [];
  private head = 0;

  enqueue(element: T): void {
    this.elements.push(element);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const element = this.elements[this.head];
    this.head++;
    
    // Compact array when 50% space is wasted
    if (this.head > this.elements.length / 2) {
      this.elements = this.elements.slice(this.head);
      this.head = 0;
    }
    return element;
  }

  isEmpty(): boolean {
    return this.head >= this.elements.length;
  }
}

const getNeighbors = (
  node: INode,
  grid: INode[][],
  isBombPhase: boolean
): INode[] => {
  const neighbors: INode[] = [];
  const { row, col } = node;

  // Pre-allocate array size for neighbors
  const possibleNeighbors: (INode | null)[] = new Array(4);
  
  possibleNeighbors[0] = row > 0 ? grid[row - 1][col] : null;
  possibleNeighbors[1] = row < grid.length - 1 ? grid[row + 1][col] : null;
  possibleNeighbors[2] = col > 0 ? grid[row][col - 1] : null;
  possibleNeighbors[3] = col < grid[0].length - 1 ? grid[row][col + 1] : null;

  for (const neighbor of possibleNeighbors) {
    if (!neighbor) continue;
    
    const isUnvisited = isBombPhase 
      ? !neighbor.isPurpleVisited 
      : !neighbor.isBlueVisited;
      
    if (!neighbor.isWall && isUnvisited) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
};

export const bfs = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const isBombPhase = finishNode.isBomb;
  const visitedNodesInOrder: INode[] = [];
  const queue = new EfficientQueue<INode>();

  // Fast reset using grid coordinates
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
  
  queue.enqueue(startNode);
  visitedNodesInOrder.push(startNode);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue()!;

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(currentNode, grid, isBombPhase);

    for (const neighbor of neighbors) {
      // Mark visited immediately to prevent duplicate processing
      if (isBombPhase) {
        neighbor.isPurpleVisited = true;
      } else {
        neighbor.isBlueVisited = true;
      }
      
      neighbor.previousNode = currentNode;
      visitedNodesInOrder.push(neighbor);
      queue.enqueue(neighbor);

      // Early exit when finding finish node
      if (neighbor === finishNode) {
        return visitedNodesInOrder;
      }
    }
  }

  return visitedNodesInOrder;
};
