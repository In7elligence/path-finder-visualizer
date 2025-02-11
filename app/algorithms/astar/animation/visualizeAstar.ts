import { IGridState } from "@/app/interfaces/interfaces";
import { GridAction } from "@/app/components/Grid/gridReducer";
import { resetGridForAlgorithm } from "../../utils/resetGridForAlgorithm";
import { astar, getNodesInShortestPathOrderAStar } from "../utils/astar";

export const visualizeAstar = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode, animationDuration, isAlgoRunning } =
    state;

  if (isAlgoRunning) return;

  // Reset the grid for the algorithm
  const newGrid = resetGridForAlgorithm(grid);
  dispatch({ type: "SET_GRID", payload: newGrid });

  // Reset the shortest path nodes and visited nodes
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_NODES", payload: [] });

  dispatch({ type: "TOGGLE_ALGO", payload: true });

  const start = newGrid[startNode.row][startNode.col];
  const finish = newGrid[finishNode.row][finishNode.col];

  const visitedNodesInOrder = astar(newGrid, start, finish);
  const nodesInShortestPathOrder = getNodesInShortestPathOrderAStar(finish);

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
