import { IGridState, INode } from "@/app/interfaces/interfaces";
import { AvailableAlgorithms } from "@/app/types/types";

export type GridAction =
  | { type: "SET_GRID"; payload: INode[][] }
  | { type: "TOGGLE_MOUSE_PRESSED"; payload: boolean }
  | { type: "SET_GRID_DIMENSIONS"; payload: { rows: number; cols: number } }
  | { type: "SET_START_NODE"; payload: { row: number; col: number } }
  | { type: "SET_FINISH_NODE"; payload: { row: number; col: number } }
  | { type: "SET_VISITED_NODES"; payload: INode[] }
  | { type: "SET_NODES_IN_SHORTEST_PATH"; payload: INode[] }
  | { type: "TOGGLE_ALGO"; payload: boolean }
  | { type: "SET_SELECTED_ALGORITHM"; payload: AvailableAlgorithms };

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
    case "SET_VISITED_NODES":
      return { ...state, visitedNodes: action.payload };
    case "SET_NODES_IN_SHORTEST_PATH":
      return { ...state, nodesInShortestPath: action.payload };
    case "TOGGLE_ALGO":
      return { ...state, isAlgoRunning: action.payload };
    case "SET_SELECTED_ALGORITHM":
      return { ...state, selectedAlgorithm: action.payload };
    default:
      return state;
  }
};
