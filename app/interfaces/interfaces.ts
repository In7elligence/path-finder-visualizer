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
  isPurpleVisited: boolean;
  isBlueVisited: boolean;
  isWall: boolean;
  isMazeWall: boolean;
  previousNode: INode | null;
  isBomb: boolean;
  isPath?: boolean; // Marks nodes in the guaranteed path
  direction?: NodeDirection;
  cachedDirection?: NodeDirection;
  gCost?: number; // Cost from start node to this node
  hCost?: number; // Heuristic cost from this node to finish node
  fCost?: number; // Total cost (gCost + hCost)
}

export interface IGridState {
  grid: INode[][];
  isMousePressed: boolean;
  gridDimensions: { rows: number; cols: number };
  startNode: { row: number; col: number };
  finishNode: { row: number; col: number };
  bombNode: { row: number; col: number };
  visitedPurpleNodes: INode[];
  visitedBlueNodes: INode[];
  nodesInShortestPath: INode[];
  selectedAlgorithm: AvailableAlgorithms;
  isAlgoRunning: boolean;
  visitedNodeAnimationDuration: number;
  pathAnimationDuration: number;
  bombDefused?: boolean;
}

export interface IMenuItem {
  type: NavItemType;
  name: string;
  href?: string;
  value?: string;
  children?: IMenuItem[];
  onClick?: (value?: string) => void;
}
