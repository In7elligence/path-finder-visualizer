import { IGridState, INode } from "@/app/interfaces/interfaces";
import { GridAction } from "@/app/components/Grid/gridReducer";
import { dijkstra } from "../utils/dijkstras";
import {
  animateBombPhase,
  animateNeutralPhase,
  animatePath,
  getNodesInShortestPathOrder,
} from "@/app/utils/utils";
import { resetGridForAlgorithm } from "../../utils/utils";
import { animationManager } from "../../AnimationManager/AnimationManager";

export const visualizeDijkstras = async (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const {
    grid,
    startNode,
    finishNode,
    bombNode: initBombNode,
    visitedNodeAnimationDuration,
    pathAnimationDuration,
    isAlgoRunning,
  } = state;

  if (isAlgoRunning) return;

  animationManager.clearAllTimeouts();

  const newGrid = resetGridForAlgorithm(grid);

  dispatch({ type: "SET_GRID", payload: newGrid });
  dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
  dispatch({ type: "SET_VISITED_PURPLE_NODES", payload: [] });
  dispatch({ type: "SET_VISITED_BLUE_NODES", payload: [] });
  dispatch({ type: "TOGGLE_ALGO", payload: true });

  const start = newGrid[startNode.row][startNode.col];
  const finish = newGrid[finishNode.row][finishNode.col];
  let bombNode: INode | undefined;

  if (initBombNode.row !== -1 && initBombNode.col !== -1) {
    dispatch({ type: "SET_BOMB_DEFUSE_STATE", payload: false });

    bombNode = newGrid[initBombNode.row][initBombNode.col];
  }

  if (bombNode) {
    const purpleVisitedNodes = dijkstra(newGrid, start, bombNode);
    await animateBombPhase(
      purpleVisitedNodes,
      visitedNodeAnimationDuration,
      dispatch
    );

    const shortestPathToBomb = getNodesInShortestPathOrder(bombNode);

    const bombAsStart = newGrid[bombNode.row][bombNode.col];

    const blueVisitedNodes = dijkstra(newGrid, bombAsStart, finish);
    await animateNeutralPhase(
      blueVisitedNodes,
      visitedNodeAnimationDuration,
      dispatch
    );

    const shortestPathFromBombTofinish = getNodesInShortestPathOrder(finish);

    const fullPath = [...shortestPathToBomb, ...shortestPathFromBombTofinish];

    await animatePath(fullPath, pathAnimationDuration, dispatch);
  } else {
    const visitedNodes = dijkstra(newGrid, start, finish);
    const path = getNodesInShortestPathOrder(finish);
    await animateNeutralPhase(
      visitedNodes,
      visitedNodeAnimationDuration,
      dispatch
    );
    await animatePath(path, pathAnimationDuration, dispatch);
  }

  dispatch({ type: "TOGGLE_ALGO", payload: false });
};
