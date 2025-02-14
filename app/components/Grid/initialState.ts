import { IGridState } from "@/app/interfaces/interfaces";

export const initialGridState: IGridState = {
  grid: [[]],
  isMousePressed: false,
  gridDimensions: { rows: 0, cols: 0 },
  startNode: { row: 0, col: 0 },
  finishNode: { row: 0, col: 0 },
  bombNode: { row: -1, col: -1 },
  visitedNodes: [],
  nodesInShortestPath: [],
  selectedAlgorithm: "dijkstras",
  isAlgoRunning: false,
  animationDuration: 10, // Animation/setTimeout duration
};
