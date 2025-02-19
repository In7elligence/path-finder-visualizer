import { animationManager } from "../algorithms/AnimationManager/AnimationManager";
import { visualizeAstar } from "../algorithms/astar/animation/visualizeAstar";
import { visualizebellmanFords } from "../algorithms/bellmanford/animation/visualizeBellmanFord";
import { visualizeBFS } from "../algorithms/bfs/animation/visualizeBFS";
import { visualizeDFS } from "../algorithms/dfs/animation/visualizeDFS";
import { visualizeDijkstras } from "../algorithms/dijkstras/animation/visualizeDijkstras";
import { visualizeGreedyBFS } from "../algorithms/greedyBFS/animation/visualizeGreedyBFS";
import { visualizeBasicWeightMaze } from "../algorithms/mazes/animations/basicWeightMaze";
import { visualizeRandomBasicMaze } from "../algorithms/mazes/animations/randomBasicMaze";
import { visualizeRecursiveDivision } from "../algorithms/mazes/animations/recursiveDivisionMaze";
import { visualizeSwarmBidirectional } from "../algorithms/swarm/animation/visualizeSwarmBidirectional";
import { removeWallsAndWeightsFromGrid } from "../algorithms/utils/utils";
import { GridAction } from "../components/Grid/gridReducer";
import { dropSpecialNode } from "../components/Grid/helperFnList";
import { NODE_SIZE } from "../constants/constants";
import { IGridState, INode } from "../interfaces/interfaces";
import { AvailableMazes } from "../types/types";

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
export const calculateGridDimensions = (
  nodeSize: number,
  navWrapper: HTMLDivElement | null
) => {
  const width = window.innerWidth;
  const navHeight = navWrapper?.clientHeight || 0; // Get dynamic nav height
  const availableHeight = window.innerHeight - navHeight;

  const cols = Math.floor(width / nodeSize) - 1; // -1 for horizontal overflow buffer
  const rows = Math.floor(availableHeight / nodeSize);

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
    weight: 1,
    isMazeWall: false,
    isWall: !node.isWall,
  };
  // Case to prevent start and finish nodes becoming walls
  if (newGrid[row][col].isStart || newGrid[row][col].isFinish) {
    return newGrid;
  }

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

export const getNodesInShortestPathOrderReverse = (
  meetingNode: INode,
  finish: INode
): INode[] => {
  const nodes: INode[] = [];
  let currentNode: INode | null = finish;

  // Trace backward from finish to meeting node
  while (currentNode && currentNode !== meetingNode) {
    nodes.push(currentNode);
    currentNode = currentNode.previousNode;
  }

  if (currentNode === meetingNode) {
    nodes.push(meetingNode);
  }

  return nodes.reverse();
};

export const doesBombExistInGrid = (grid: INode[][]) => {
  return grid.some((row) => row.some((node) => node.isBomb));
};

export const doesGridHaveWeights = (grid: INode[][]) => {
  return grid.some((row) => row.some((node) => node.weight > 1));
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

export const clearPath = (dispatch: React.Dispatch<GridAction>) => {
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_PURPLE_NODES", payload: [] });
  dispatch({ type: "SET_VISITED_BLUE_NODES", payload: [] });
};

export const clearWallsAndWeights = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid } = state;

  const newGrid = removeWallsAndWeightsFromGrid(grid);

  dispatch({ type: "SET_GRID", payload: newGrid });
};

export const generateMaze = (
  state: IGridState,
  maze: AvailableMazes,
  dispatch: React.Dispatch<GridAction>,
  navWrapper: HTMLDivElement | null, // needed for dynamic calculation of node weights
  nodeSize: number // needed for dynamic calculation of node weights
) => {
  switch (maze) {
    case "randomBasicMaze":
      visualizeRandomBasicMaze(state, dispatch);
      break;
    case "basicWeightMaze":
      visualizeBasicWeightMaze(state, dispatch, navWrapper, nodeSize);
      break;
    case "recursiveDivision":
      visualizeRecursiveDivision(state, dispatch);
      break;
    case "recursiveDivisionVerticalSkew":
      visualizeRecursiveDivision(state, dispatch, "vertical");
      break;
    case "recursiveDivisionHorizontalSkew":
      visualizeRecursiveDivision(state, dispatch, "horizontal");
      break;
    default:
      visualizeRecursiveDivision(state, dispatch);
  }
};

export const placeRandomBomb = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode, selectedAlgorithm } = state;

  // We cannot place a bomb during Bidirectional Swarm Algorithm
  if (selectedAlgorithm === "swarmBidirectional") return;

  const validNodes = grid
    .flat()
    .filter(
      (node) =>
        !node.isWall &&
        !node.isStart &&
        !node.isFinish &&
        node.weight <= 1 &&
        Math.abs(node.row - startNode.row) +
          Math.abs(node.col - startNode.col) >
          5 &&
        Math.abs(node.row - finishNode.row) +
          Math.abs(node.col - finishNode.col) >
          5
    );

  if (validNodes.length > 0) {
    const randomNode =
      validNodes[Math.floor(Math.random() * validNodes.length)];
    dropSpecialNode(state, randomNode.row, randomNode.col, "bomb", dispatch);
  }
};

export const removeBomb = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid } = state;

  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isBomb: false,
    }))
  );

  dispatch({ type: "SET_GRID", payload: newGrid });
  dispatch({ type: "SET_BOMB_NODE", payload: { row: -1, col: -1 } });
  dispatch({ type: "SET_BOMB_DEFUSE_STATE", payload: undefined });
};

export const visualizeAlgorithm = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { selectedAlgorithm } = state;

  switch (selectedAlgorithm) {
    case "dijkstras":
      visualizeDijkstras(state, dispatch);
      break;
    case "astar":
      visualizeAstar(state, dispatch);
      break;
    case "bellmanford":
      visualizebellmanFords(state, dispatch);
      break;
    case "greedyBFS":
      visualizeGreedyBFS(state, dispatch);
      break;
    case "swarmBidirectional":
      visualizeSwarmBidirectional(state, dispatch);
      break;
    case "bfs":
      visualizeBFS(state, dispatch);
      break;
    case "dfs":
      visualizeDFS(state, dispatch);
      break;
    default:
      visualizeDijkstras(state, dispatch);
  }
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
          currentNode.direction = latestDirection;
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

export const animateMaze = async (
  grid: INode[][],
  walls: INode[],
  duration: number,
  dispatch: React.Dispatch<GridAction>
) => {
  const animatedWalls = [...walls];
  const workingGrid = grid.map((row) => row.map((node) => ({ ...node })));

  // Calculate batch parameters
  const TARGET_FRAME_DURATION = 16; // ~60 FPS
  const totalFrames = Math.max(1, Math.floor(duration / TARGET_FRAME_DURATION));
  const wallsPerFrame = Math.ceil(animatedWalls.length / totalFrames);

  let currentIndex = 0;

  const animateBatch = async () => {
    if (currentIndex >= animatedWalls.length) return;

    // Update walls for this batch
    const batchEnd = Math.min(
      currentIndex + wallsPerFrame,
      animatedWalls.length
    );
    for (let i = currentIndex; i < batchEnd; i++) {
      const wall = animatedWalls[i];
      workingGrid[wall.row][wall.col].isWall = true;
      workingGrid[wall.row][wall.col].isMazeWall = true;
    }
    currentIndex = batchEnd;

    // Dispatch grid update
    dispatch({
      type: "SET_GRID",
      payload: workingGrid.map((row) => row.map((node) => ({ ...node }))),
    });

    // Schedule next batch
    await new Promise((resolve) => setTimeout(resolve, TARGET_FRAME_DURATION));
    await animateBatch();
  };

  await animateBatch();
};
