import {
  AvailableAlgorithms,
  NavItemType,
  NodeDirection,
} from "../types/types";

export interface INode {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  isMazeWall: boolean;
  previousNode: INode | null;
  isPath?: boolean; // Marks nodes in the guaranteed path
  direction?: NodeDirection;
  isActiveArrow?: boolean;
  gCost?: number; // Cost from start node to this node (used by A*)
  hCost?: number; // Heuristic cost from this node to finish node (used by A*)
  fCost?: number; // Total cost (gCost + hCost) (used by A*)
}

export interface IGridState {
  grid: INode[][];
  isMousePressed: boolean;
  gridDimensions: { rows: number; cols: number };
  startNode: { row: number; col: number };
  finishNode: { row: number; col: number };
  visitedNodes: INode[];
  nodesInShortestPath: INode[];
  selectedAlgorithm: AvailableAlgorithms;
  isAlgoRunning: boolean;
  animationDuration: number;
}

export interface IMenuItem {
  type: NavItemType;
  name: string;
  href?: string;
  value?: string;
  children?: IMenuItem[];
  onClick?: (value?: string) => void;
}
