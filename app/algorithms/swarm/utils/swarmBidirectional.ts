import { INode } from "@/app/interfaces/interfaces";

class PriorityQueue {
  private heap: INode[] = [];

  enqueue(node: INode) {
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

  isEmpty() {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number) {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (node.fCost! >= parent.fCost!) break;
      this.heap[parentIndex] = node;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  private sinkDown(index: number) {
    const length = this.heap.length;
    const node = this.heap[index];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swapIndex = -1;

      if (leftChildIndex < length) {
        if (this.heap[leftChildIndex].fCost! < node.fCost!) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        if (
          (swapIndex === -1 &&
            this.heap[rightChildIndex].fCost! < node.fCost!) ||
          (swapIndex !== -1 &&
            this.heap[rightChildIndex].fCost! <
              this.heap[leftChildIndex].fCost!)
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

const getNeighbors = (node: INode, grid: INode[][]): INode[] => {
  const neighbors: INode[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((n) => !n.isWall);
};

const heuristic = (a: INode, b: INode): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

const setPathDirections = (path: INode[]) => {
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    current.direction =
      next.row < current.row
        ? "up"
        : next.row > current.row
        ? "down"
        : next.col < current.col
        ? "left"
        : "right";
  }
};

export const swarmBidirectional = (
  grid: INode[][],
  start: INode,
  finish: INode
): { visitedNodes: INode[]; path: INode[] } => {
  // Reset nodes using existing properties
  grid.forEach((row) =>
    row.forEach((node) => {
      node.distance = Infinity;
      node.gCost = Infinity;
      node.fCost = Infinity;
      node.isBlueVisited = false;
      node.isPurpleVisited = false;
      node.isPath = false;
      node.previousNode = null;
    })
  );

  const forwardQueue = new PriorityQueue();
  const backwardQueue = new PriorityQueue();
  const visitedNodes: INode[] = [];

  // Internal state tracking
  const forwardCosts = new Map<INode, number>([[start, 0]]);
  const backwardCosts = new Map<INode, number>([[finish, 0]]);
  const forwardPredecessors = new Map<INode, INode>();
  const backwardPredecessors = new Map<INode, INode>();

  let meetingNode: INode | null = null;
  let safetyCounter = 0;
  const MAX_ITERATIONS = 5000; // Adjust based on grid size

  // Initialize queues
  start.gCost = 0;
  start.fCost = heuristic(start, finish);
  forwardQueue.enqueue(start);

  finish.gCost = 0;
  finish.fCost = heuristic(finish, start);
  backwardQueue.enqueue(finish);

  while (
    (!forwardQueue.isEmpty() || !backwardQueue.isEmpty()) &&
    safetyCounter++ < MAX_ITERATIONS
  ) {
    // Process forward search
    if (!forwardQueue.isEmpty()) {
      const currentForward = forwardQueue.dequeue()!;
      if (currentForward.isBlueVisited) continue;

      currentForward.isBlueVisited = true;
      visitedNodes.push(currentForward);

      // Check meeting condition
      if (backwardCosts.has(currentForward)) {
        meetingNode = currentForward;
        break;
      }

      // Process neighbors
      const neighbors = getNeighbors(currentForward, grid);
      for (const neighbor of neighbors) {
        const newCost = forwardCosts.get(currentForward)! + neighbor.weight;
        if (newCost < (forwardCosts.get(neighbor) ?? Infinity)) {
          forwardCosts.set(neighbor, newCost);
          forwardPredecessors.set(neighbor, currentForward);
          neighbor.gCost = newCost;
          neighbor.fCost = newCost + heuristic(neighbor, finish);
          forwardQueue.enqueue(neighbor);
        }
      }
    }

    // Process backward search
    if (!backwardQueue.isEmpty()) {
      const currentBackward = backwardQueue.dequeue()!;
      if (currentBackward.isPurpleVisited) continue;

      currentBackward.isPurpleVisited = true;
      visitedNodes.push(currentBackward);

      // Check meeting condition
      if (forwardCosts.has(currentBackward)) {
        meetingNode = currentBackward;
        break;
      }

      // Process neighbors
      const neighbors = getNeighbors(currentBackward, grid);
      for (const neighbor of neighbors) {
        const newCost = backwardCosts.get(currentBackward)! + neighbor.weight;
        if (newCost < (backwardCosts.get(neighbor) ?? Infinity)) {
          backwardCosts.set(neighbor, newCost);
          backwardPredecessors.set(neighbor, currentBackward);
          neighbor.gCost = newCost;
          neighbor.fCost = newCost + heuristic(neighbor, start);
          backwardQueue.enqueue(neighbor);
        }
      }
    }
  }

  let path: INode[] = [];
  if (meetingNode) {
    // Build forward path
    const forwardPath: INode[] = [];
    let current: INode | null = meetingNode;
    while (current) {
      forwardPath.unshift(current);
      current = forwardPredecessors.get(current)!;
    }

    // Build backward path
    const backwardPath: INode[] = [];
    current = backwardPredecessors.get(meetingNode)!;
    while (current) {
      backwardPath.push(current);
      current = backwardPredecessors.get(current)!;
    }

    path = [...forwardPath, ...backwardPath];
    path.forEach((node, index) => {
      node.isPath = true;
      node.previousNode = path[index - 1] || null;
    });
    setPathDirections(path);
  }

  return { visitedNodes, path };
};
