import { NodeDirection } from "../types/types";

export interface INode {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: INode | null;
  direction?: NodeDirection;
}

export interface IGridState {
  grid: INode[][];
  isMousePressed: boolean;
  gridDimensions: { rows: number; cols: number };
  startNode: { row: number; col: number };
  finishNode: { row: number; col: number };
  visitedNodes: INode[];
  nodesInShortestPath: INode[];
  isAlgoRunning: boolean;
}
