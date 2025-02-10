import { IGridState, INode } from "@/app/interfaces/interfaces";

type GridAction =
  | { type: "SET_GRID"; payload: INode[][] }
  | { type: "TOGGLE_MOUSE_PRESSED"; payload: boolean }
  | { type: "SET_GRID_DIMENSIONS"; payload: { rows: number; cols: number } }
  | { type: "SET_START_NODE"; payload: { row: number; col: number } }
  | { type: "SET_FINISH_NODE"; payload: { row: number; col: number } }
  | { type: "SET_VISITED_NODES"; payload: INode[] }
  | { type: "SET_NODES_IN_SHORTEST_PATH"; payload: INode[] }
  | { type: "TOGGLE_ALGO"; payload: boolean };

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
        return { ...state, isAlgoRunning: action.payload }
    default:
      return state;
  }
};
