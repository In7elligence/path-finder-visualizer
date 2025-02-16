import { INode } from "@/app/interfaces/interfaces";

class PriorityQueue {
  private heap: INode[];
  private comparator: (a: INode, b: INode) => number;

  constructor(comparator: (a: INode, b: INode) => number) {
    this.heap = [];
    this.comparator = comparator;
  }

  enqueue(node: INode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): INode | undefined {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.comparator(node, parent) < 0) {
        this.heap[index] = parent;
        this.heap[parentIndex] = node;
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    const node = this.heap[index];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swapIndex = -1;

      if (leftChildIndex < length) {
        if (this.comparator(this.heap[leftChildIndex], node) < 0) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        if (
          this.comparator(
            this.heap[rightChildIndex],
            swapIndex === -1 ? node : this.heap[leftChildIndex]
          ) < 0
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === -1) break;
      this.heap[index] = this.heap[swapIndex];
      this.heap[swapIndex] = node;
      index = swapIndex;
    }
  }
}

const getOptimizedNeighbors = (
  node: INode,
  grid: INode[][],
  isBombPhase: boolean
): INode[] => {
  const neighbors: INode[] = [];
  const { row, col } = node;

  // Pre-check valid positions and visit status
  if (col < grid[0].length - 1) {
    const neighbor = grid[row][col + 1];
    if (
      !neighbor.isWall &&
      (isBombPhase ? !neighbor.isPurpleVisited : !neighbor.isBlueVisited)
    ) {
      neighbors.push(neighbor);
    }
  }
  if (col > 0) {
    const neighbor = grid[row][col - 1];
    if (
      !neighbor.isWall &&
      (isBombPhase ? !neighbor.isPurpleVisited : !neighbor.isBlueVisited)
    ) {
      neighbors.push(neighbor);
    }
  }
  if (row < grid.length - 1) {
    const neighbor = grid[row + 1][col];
    if (
      !neighbor.isWall &&
      (isBombPhase ? !neighbor.isPurpleVisited : !neighbor.isBlueVisited)
    ) {
      neighbors.push(neighbor);
    }
  }
  if (row > 0) {
    const neighbor = grid[row - 1][col];
    if (
      !neighbor.isWall &&
      (isBombPhase ? !neighbor.isPurpleVisited : !neighbor.isBlueVisited)
    ) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
};

export const greedyBFS = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] => {
  const isBombPhase = finishNode.isBomb;
  const visitedNodesInOrder: INode[] = [];
  const pq = new PriorityQueue((a, b) => a.hCost! - b.hCost!);

  // Fast grid initialization
  const finishRow = finishNode.row;
  const finishCol = finishNode.col;
  for (let row = 0; row < grid.length; row++) {
    const gridRow = grid[row];
    for (let col = 0; col < gridRow.length; col++) {
      const node = gridRow[col];
      node.hCost = Math.abs(row - finishRow) + Math.abs(col - finishCol);
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

  pq.enqueue(startNode);
  visitedNodesInOrder.push(startNode);

  while (!pq.isEmpty()) {
    const currentNode = pq.dequeue()!;

    // Early exit check
    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getOptimizedNeighbors(currentNode, grid, isBombPhase);

    for (const neighbor of neighbors) {
      // Mark visited before queuing to prevent duplicates
      if (isBombPhase) {
        neighbor.isPurpleVisited = true;
      } else {
        neighbor.isBlueVisited = true;
      }

      neighbor.previousNode = currentNode;
      visitedNodesInOrder.push(neighbor);
      pq.enqueue(neighbor);

      // Immediate return when finding finish node
      if (neighbor === finishNode) {
        return visitedNodesInOrder;
      }
    }
  }

  return visitedNodesInOrder;
};
