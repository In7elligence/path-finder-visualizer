import { GridAction } from "../components/Grid/gridReducer";
import { INode } from "../interfaces/interfaces";

export const getNewGridWithWallToggled = (
  grid: INode[][],
  row: number,
  col: number
): INode[][] => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

/*!
 * Backtracks from the finishNode to find the shortest path.
 * Only works when called *after* the algorithmic methods method.
!*/
export const getNodesInShortestPathOrder = (finishNode: INode | null) => {
  const nodesInShortestPathOrder: INode[] = [];
  let currentNode: INode | null = finishNode;

  if (!currentNode) {
    return nodesInShortestPathOrder;
  }

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  for (let i = 0; i < nodesInShortestPathOrder.length - 1; i++) {
    const current = nodesInShortestPathOrder[i];
    const next = nodesInShortestPathOrder[i + 1];

    if (next.row < current.row) {
      current.direction = "up";
    } else if (next.row > current.row) {
      current.direction = "down";
    } else if (next.col < current.col) {
      current.direction = "left";
    } else if (next.col > current.col) {
      current.direction = "right";
    }
  }

  return nodesInShortestPathOrder;
};

export const animateAlgorithm = (
  visitedNodesInOrder: INode[],
  nodesInShortestPathOrder: INode[],
  animationDuration: number,
  dispatch: React.Dispatch<GridAction>
) => {
  // Calculate total animation time
  const totalAnimationTime =
    visitedNodesInOrder.length * animationDuration + // Time for visited nodes
    nodesInShortestPathOrder.length * animationDuration; // Time for shortest path nodes

  // Animate visited nodes
  for (let i = 0; i < visitedNodesInOrder.length; i++) {
    setTimeout(() => {
      dispatch({
        type: "SET_VISITED_NODES",
        payload: visitedNodesInOrder.slice(0, i + 1),
      });
    }, animationDuration * i);
  }

  // Animate shortest path nodes one at a time
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      // Update the shortest path nodes to include only the current node
      dispatch({
        type: "SET_NODES_IN_SHORTEST_PATH",
        payload: nodesInShortestPathOrder.slice(0, i + 1),
      });
    }, visitedNodesInOrder.length * animationDuration + i * animationDuration);
  }

  // Set algorithm running state to false after all animations are complete
  setTimeout(() => {
    dispatch({ type: "TOGGLE_ALGO", payload: false });
  }, totalAnimationTime);
};
