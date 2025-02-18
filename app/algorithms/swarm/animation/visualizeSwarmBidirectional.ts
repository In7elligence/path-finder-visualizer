import { IGridState } from "@/app/interfaces/interfaces";
import { GridAction } from "@/app/components/Grid/gridReducer";
import { animateNeutralPhase, animatePath } from "@/app/utils/utils";
import { resetGridForAlgorithm } from "../../utils/utils";
import { animationManager } from "../../AnimationManager/AnimationManager";
import { swarmBidirectional } from "../utils/swarmBidirectional";

export const visualizeSwarmBidirectional = async (
  state: IGridState,
  dispatch: React.Dispatch<GridAction>
) => {
  const {
    grid,
    startNode,
    finishNode,
    visitedNodeAnimationDuration,
    pathAnimationDuration,
    isAlgoRunning,
    bombNode
  } = state;

  console.log("bombNode: ", bombNode);

  // No bombs allowed during Bidirectional Swarm Algorithm
  if (bombNode.row !== -1 && bombNode.col !== -1) return;

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

  const { visitedNodes, path } = swarmBidirectional(newGrid, start, finish);

  await animateNeutralPhase(
    visitedNodes,
    visitedNodeAnimationDuration,
    dispatch
  );
  await animatePath(path, pathAnimationDuration, dispatch);

  dispatch({ type: "TOGGLE_ALGO", payload: false });
};
