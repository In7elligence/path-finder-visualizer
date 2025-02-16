import { IGridState, INode } from "@/app/interfaces/interfaces";
import { GridAction } from "@/app/components/Grid/gridReducer";
import { bfs } from "../utils/bfs";
import {
  animateBombPhase,
  animateNeutralPhase,
  animatePath,
  getNodesInShortestPathOrder,
} from "@/app/utils/utils";
import { resetGridForAlgorithm } from "../../utils/utils";
import { animationManager } from "../../AnimationManager/AnimationManager";

export const visualizeBFS = async (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const {
    grid,
    startNode,
    finishNode,
    bombNode: initBombNode,
    animationDuration,
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
    bombNode = newGrid[initBombNode.row][initBombNode.col];
  }

  if (bombNode) {
    // Phase 1: Start → Bomb
    const purpleVisitedNodes = bfs(newGrid, start, bombNode);
    await animateBombPhase(purpleVisitedNodes, animationDuration, dispatch);

    // Mark bomb as defused
    dispatch({ type: "SET_BOMB_DEFUSE_STATE", payload: true });

    const shortestPathToBomb = getNodesInShortestPathOrder(bombNode);

    // Phase 2: Bomb → Finish (no grid reset!)
    const bombAsStart = newGrid[bombNode.row][bombNode.col];
    const blueVisitedNodes = bfs(newGrid, bombAsStart, finish);
    await animateNeutralPhase(blueVisitedNodes, animationDuration, dispatch);

    const shortestPathFromBombTofinish = getNodesInShortestPathOrder(finish);

    // Get full path from finish node
    const fullPath = [...shortestPathToBomb, ...shortestPathFromBombTofinish];
    await animatePath(fullPath, animationDuration, dispatch);
  } else {
    // No bomb case
    const visitedNodes = bfs(newGrid, start, finish);
    const path = getNodesInShortestPathOrder(finish);
    await animateNeutralPhase(visitedNodes, animationDuration, dispatch);
    await animatePath(path, animationDuration, dispatch);
  }

  dispatch({ type: "TOGGLE_ALGO", payload: false });
};
