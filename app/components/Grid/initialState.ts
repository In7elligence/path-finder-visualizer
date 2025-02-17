import { IGridState } from "@/app/interfaces/interfaces";

export const initialGridState: IGridState = {
  grid: [[]],
  isMousePressed: false,
  gridDimensions: { rows: 0, cols: 0 },
  startNode: { row: 0, col: 0 },
  finishNode: { row: 0, col: 0 },
  bombNode: { row: -1, col: -1 },
  visitedBlueNodes: [],
  visitedPurpleNodes: [],
  nodesInShortestPath: [],
  selectedAlgorithm: "dijkstras",
  isAlgoRunning: false,
  animationSpeed: "fast", // Text indication of the animation speed in general (fast by default)
  visitedNodeAnimationDuration: 10, // Animation/setTimeout duration for visited nodes
  pathAnimationDuration: 50, // Animation/setTimeout duration for final path
};
