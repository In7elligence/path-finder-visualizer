import { IGridState, INode } from "@/app/interfaces/interfaces";
import { AnimationSpeed, AvailableAlgorithms } from "@/app/types/types";

export type GridAction =
  | { type: "SET_GRID"; payload: INode[][] }
  | { type: "TOGGLE_MOUSE_PRESSED"; payload: boolean }
  | { type: "SET_GRID_DIMENSIONS"; payload: { rows: number; cols: number } }
  | { type: "SET_START_NODE"; payload: { row: number; col: number } }
  | { type: "SET_FINISH_NODE"; payload: { row: number; col: number } }
  | { type: "SET_BOMB_NODE"; payload: { row: number; col: number } }
  | { type: "SET_BOMB_DEFUSE_STATE"; payload: boolean | undefined }
  | { type: "SET_VISITED_PURPLE_NODES"; payload: INode[] }
  | { type: "SET_VISITED_BLUE_NODES"; payload: INode[] }
  | { type: "SET_NODES_IN_SHORTEST_PATH"; payload: INode[] }
  | { type: "TOGGLE_ALGO"; payload: boolean }
  | { type: "SET_SELECTED_ALGORITHM"; payload: AvailableAlgorithms }
  | { type: "SET_ANIMATION_SPEED"; payload: AnimationSpeed }
  | { type: "SET_VISITED_NODE_ANIMATION_SPEED"; payload: number }
  | { type: "SET_PATH_NODE_ANIMATION_SPEED"; payload: number }
  | { type: "SET_MAZE_ANIMATION_SPEED"; payload: number };

export const gridReducer = (
  state: IGridState,
  action: GridAction
): IGridState => {
  switch (action.type) {
    case "SET_GRID":
      return { ...state, grid: action.payload };
    case "TOGGLE_MOUSE_PRESSED":
      return { ...state, isMousePressed: action.payload };
    case "SET_GRID_DIMENSIONS":
      return { ...state, gridDimensions: action.payload };
    case "SET_START_NODE":
      return { ...state, startNode: action.payload };
    case "SET_FINISH_NODE":
      return { ...state, finishNode: action.payload };
    case "SET_BOMB_NODE":
      return { ...state, bombNode: action.payload };
    case "SET_BOMB_DEFUSE_STATE":
      return { ...state, bombDefused: action.payload };
    case "SET_VISITED_PURPLE_NODES":
      return { ...state, visitedPurpleNodes: action.payload };
    case "SET_VISITED_BLUE_NODES":
      return { ...state, visitedBlueNodes: action.payload };
    case "SET_NODES_IN_SHORTEST_PATH":
      return { ...state, nodesInShortestPath: action.payload };
    case "TOGGLE_ALGO":
      return { ...state, isAlgoRunning: action.payload };
    case "SET_SELECTED_ALGORITHM":
      return { ...state, selectedAlgorithm: action.payload };
    case "SET_ANIMATION_SPEED":
      return { ...state, animationSpeed: action.payload };
    case "SET_VISITED_NODE_ANIMATION_SPEED":
      return { ...state, visitedNodeAnimationDuration: action.payload };
    case "SET_PATH_NODE_ANIMATION_SPEED":
      return { ...state, pathAnimationDuration: action.payload };
      case "SET_MAZE_ANIMATION_SPEED":
        return { ...state, mazeAnimationDuration: action.payload };
    default:
      return state;
  }
};
