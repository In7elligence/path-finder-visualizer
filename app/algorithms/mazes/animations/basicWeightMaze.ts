import { IGridState, INode } from "@/app/interfaces/interfaces";
import { removeWallsAndWeightsFromGrid } from "../../utils/utils";
import { GridAction } from "@/app/components/Grid/gridReducer";

const animateBasicWeightMaze = (
  initialGrid: INode[][],
  nodes: INode[],
  animationDuration: number,
  dispatch: React.Dispatch<GridAction>,
  navWrapper: HTMLDivElement | null,
  nodeSize: number
) => {
  /*!
   * Using dynamic maxWeight to ensure algorithmic
   * consistency across all screen dimensions
  !*/

  const width = window.innerWidth;
  const navHeight = navWrapper?.clientHeight || 0; // Get dynamic nav height
  const availableHeight = window.innerHeight - navHeight;

  const cols = Math.floor(width / nodeSize) - 1; // -1 for horizontal overflow buffer
  const rows = Math.floor(availableHeight / nodeSize);

  // Max weight for smaller screens
  let maxWeight = 10;

  // Max weight for larger screens
  if (cols >= 60 && rows >= 60) {
    maxWeight = 15;
  }

  const gridWithWeights = initialGrid.map((row) =>
    row.map((node) => {
      const isWeighted = nodes.some(
        (w) => w.row === node.row && w.col === node.col
      );
      return {
        ...node,
        weight: isWeighted ? node.weight : maxWeight,
      };
    })
  );

  dispatch({ type: "SET_GRID", payload: gridWithWeights });

  setTimeout(() => {
    dispatch({ type: "TOGGLE_ALGO", payload: false });
  }, animationDuration);
};

export const visualizeBasicWeightMaze = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>,
  navWrapper: HTMLDivElement | null,
  nodeSize: number
) => {
  const { grid: initGrid, visitedNodeAnimationDuration, isAlgoRunning } = state;

  if (isAlgoRunning) return;

  const newGrid = removeWallsAndWeightsFromGrid(initGrid);

  dispatch({ type: "SET_GRID", payload: newGrid });
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_PURPLE_NODES", payload: [] });
  dispatch({ type: "SET_VISITED_BLUE_NODES", payload: [] });
  dispatch({ type: "TOGGLE_ALGO", payload: true });

  const nodes: INode[] = [];

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (
        Math.random() < 0.3 &&
        !newGrid[row][col].isStart &&
        !newGrid[row][col].isFinish &&
        !newGrid[row][col].isBomb &&
        !newGrid[row][col].isWall &&
        !newGrid[row][col].isMazeWall &&
        newGrid[row][col].weight <= 1
      ) {
        nodes.push(newGrid[row][col]);
      }
    }
  }

  animateBasicWeightMaze(
    newGrid,
    nodes,
    visitedNodeAnimationDuration,
    dispatch,
    navWrapper,
    nodeSize
  );
};
