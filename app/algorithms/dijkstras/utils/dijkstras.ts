/*!
 * Performs Dijkstra's algorithm.
 * Returns all nodes in the order in which they were visited.
 * Also makes nodes point back to their previous node,
 * effectively allowing us to compute the shortest path.
!*/

import { INode } from "@/app/interfaces/interfaces";

class PriorityQueue<T> {
  private heap: { element: T; priority: number }[];

  constructor() {
    this.heap = [];
  }

  enqueue(element: T, priority: number): void {
    this.heap.push({ element, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): { element: T; priority: number } | null {
    if (this.isEmpty()) return null;
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
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.priority < parent.priority) {
        this.heap[index] = parent;
        this.heap[parentIndex] = element;
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swapIndex = null;

      if (leftChildIndex < length) {
        const leftChild = this.heap[leftChildIndex];
        if (leftChild.priority < element.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.heap[rightChildIndex];
        if (
          (swapIndex === null && rightChild.priority < element.priority) ||
          (swapIndex !== null &&
            rightChild.priority < this.heap[leftChildIndex].priority)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;
      this.heap[index] = this.heap[swapIndex];
      this.heap[swapIndex] = element;
      index = swapIndex;
    }
  }
}

const getNeighbors = (node: INode, grid: INode[][]): INode[] => {
  const neighbors: INode[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

// By backtracking from the finish node.
export const dijkstra = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode,
): INode[] => {
  // Reset nodes
  grid.forEach((row) =>
    row.forEach((node) => {
      node.distance = Infinity;
      node.previousNode = null;
      node.isBlueVisited = false;
      node.isPurpleVisited = false;
    }),
  );

  startNode.distance = 0;
  const visitedNodesInOrder: INode[] = [];
  const priorityQueue = new PriorityQueue<INode>();
  priorityQueue.enqueue(startNode, startNode.distance);

  while (!priorityQueue.isEmpty()) {
    const queueEntry = priorityQueue.dequeue();
    if (!queueEntry) break;

    const { element: currentNode, priority } = queueEntry;

    // Skip stale entries and walls
    if (priority > currentNode.distance || currentNode.isWall) continue;

    // Mark visited
    if (finishNode.isBomb) {
      currentNode.isPurpleVisited = true;
    } else {
      currentNode.isBlueVisited = true;
    }
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      const tentativeDistance = currentNode.distance + neighbor.weight;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = currentNode;
        priorityQueue.enqueue(neighbor, neighbor.distance);
      }
    }
  }

  return visitedNodesInOrder;
};
