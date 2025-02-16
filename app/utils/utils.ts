import { animationManager } from "../algorithms/AnimationManager/AnimationManager";
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

  // TODO: Make this dynamic by taking height of menu and calculate using that instead of fixed numbers
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
      current.cachedDirection = "up";
    } else if (next.row > current.row) {
      current.direction = "down";
      current.cachedDirection = "down";
    } else if (next.col < current.col) {
      current.direction = "left";
      current.cachedDirection = "left";
    } else if (next.col > current.col) {
      current.direction = "right";
      current.cachedDirection = "right";
    }
  }

  return nodesInShortestPathOrder;
};

export const doesBombExistInGrid = (grid: INode[][]) => {
  return grid.some((row) => row.some((node) => node.isBomb));
};

export const animateBombPhase = (
  visitedNodesInOrder: INode[],
  duration: number,
  dispatch: React.Dispatch<GridAction>
): Promise<void> => {
  animationManager.clearAllTimeouts();

  return new Promise((resolve) => {
    visitedNodesInOrder.forEach((_, i) => {
      const timeoutId = window.setTimeout(() => {
        dispatch({
          type: "SET_VISITED_PURPLE_NODES",
          payload: visitedNodesInOrder.slice(0, i + 1),
        });
      }, i * duration);
      animationManager.addTimeout(timeoutId);
    });

    const totalTime = visitedNodesInOrder.length * duration;
    const bombAnimationFinalTimeout = window.setTimeout(
      () => resolve(),
      totalTime
    );
    animationManager.addTimeout(bombAnimationFinalTimeout);
  });
};

export const animateNeutralPhase = (
  visitedNodesInOrder: INode[],
  duration: number,
  dispatch: React.Dispatch<GridAction>
): Promise<void> => {
  animationManager.clearAllTimeouts();

  return new Promise((resolve) => {
    visitedNodesInOrder.forEach((_, i) => {
      const timeoutId = window.setTimeout(() => {
        dispatch({
          type: "SET_VISITED_BLUE_NODES",
          payload: visitedNodesInOrder.slice(0, i + 1),
        });
      }, i * duration);
      animationManager.addTimeout(timeoutId);
    });

    const totalTime = visitedNodesInOrder.length * duration;
    const neutralAnimationFinalTimeout = window.setTimeout(
      () => resolve(),
      totalTime
    );
    animationManager.addTimeout(neutralAnimationFinalTimeout);
  });
};

export const animatePath = (
  PathNodesInOrder: INode[],
  duration: number,
  dispatch: React.Dispatch<GridAction>
): Promise<void> => {
  animationManager.clearAllTimeouts();

  return new Promise((resolve) => {
    PathNodesInOrder.forEach((_, i) => {
      const timeoutId = window.setTimeout(() => {
        const currentNode = PathNodesInOrder[i];
        const previousNode = PathNodesInOrder[i - 1];
        const latestDirection = previousNode?.direction;

        if (previousNode && i < PathNodesInOrder.length) {
          previousNode.direction = undefined;
        }

        if (currentNode.direction === undefined) {
          currentNode.direction = currentNode.cachedDirection;
        }

        if (currentNode.isFinish) {
          console.log({
            currentNode,
            direction: currentNode.direction
          })
        }

        if (currentNode && currentNode.isFinish && i === PathNodesInOrder.length - 1) {
          previousNode.direction = latestDirection;
        }
        
        if (currentNode.isBomb) {
          // Mark bomb as defused
          dispatch({ type: "SET_BOMB_DEFUSE_STATE", payload: true });
        }

        dispatch({
          type: "SET_NODES_IN_SHORTEST_PATH",
          payload: PathNodesInOrder.slice(0, i + 1),
        });
      }, PathNodesInOrder.length + i * duration);
      animationManager.addTimeout(timeoutId);
    });

    // Final resolve
    const totalTime = PathNodesInOrder.length * duration;
    const pathFinalTimeout = window.setTimeout(() => resolve(), totalTime);
    animationManager.addTimeout(pathFinalTimeout);
  });
};
