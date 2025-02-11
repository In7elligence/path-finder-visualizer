import { IGridState } from "@/app/interfaces/interfaces";
import { GridAction } from "@/app/components/Grid/gridReducer";
import { dijkstra } from "../utils/dijkstras";
import {
  animateAlgorithm,
  getNodesInShortestPathOrder,
} from "@/app/utils/utils";
import { resetGridForAlgorithm } from "../../utils/resetGridForAlgorithm";

export const visualizeDijkstra = (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const { grid, startNode, finishNode, animationDuration, isAlgoRunning } =
    state;

  if (isAlgoRunning) return;

  const newGrid = resetGridForAlgorithm(grid);

  dispatch({ type: "SET_GRID", payload: newGrid });
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_NODES", payload: [] });
  dispatch({ type: "TOGGLE_ALGO", payload: true });

  const start = newGrid[startNode.row][startNode.col];
  const finish = newGrid[finishNode.row][finishNode.col];

  const visitedNodesInOrder = dijkstra(newGrid, start, finish);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);

  animateAlgorithm(
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    animationDuration,
    dispatch
  );
};
