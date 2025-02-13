import { GridAction } from "../components/Grid/gridReducer";
import { NODE_SIZE } from "../constants/constants";
import { INode } from "../interfaces/interfaces";

export const getNodeSize = (screenWidth: number, screenHeight: number) => {
  // Base size for non-4K screens (e.g., 1920x1080)
  const baseSize = NODE_SIZE;

  // Scale factor for larger screens
  const scaleFactor = Math.min(screenWidth / 1920, screenHeight / 1080); // 1920x1080 is a common resolution for Full HD

  // Adjust scaling for 4K resolutions
  const adjustedScaleFactor = scaleFactor < 1 ? scaleFactor : scaleFactor * 1.5; // Increase scaling for larger screens

  // Ensure the node size doesn't get too large or too small
  return Math.max(baseSize, Math.min(baseSize * adjustedScaleFactor, 50)); // Limit node size between 25px and 50px
};

// Calculate grid dimensions based on available screen size
export const calculateGridDimensions = (nodeSize: number) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const cols = Math.floor(width / nodeSize) - 1; // -1 to account for potential overflow
  const rows = Math.floor(height / nodeSize) - 3; // -3 to account for potential overflow

  return { rows, cols };
};

export const getNewGridWithWallToggled = (
  grid: INode[][],
  row: number,
  col: number
): INode[][] => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isMazeWall: false,
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

  setTimeout(() => {
    dispatch({ type: "TOGGLE_ALGO", payload: false });
  }, totalAnimationTime);
};
