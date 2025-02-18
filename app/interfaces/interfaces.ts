import {
  AnimationSpeed,
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
  weight: number; // 1 by default
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
  animationSpeed: AnimationSpeed; // Text indication of the animation speed in general (fast by default)
  visitedNodeAnimationDuration: number;
  pathAnimationDuration: number;
  bombDefused?: boolean;
}

export interface IMenuItem {
  type: NavItemType;
  name: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  value?: string;
  onChange?: (value: string) => void;
  children?: Array<{
    name: string;
    value: string;
    type?: "option";
  }>;
  href?: string;
  isDisabled?: boolean;
  formatDisplayText?: (
    selectedOption: { name: string; value: string } | undefined
  ) => string;
}

export interface IAlgoInfoMap {
  [key: string]: {
    info: string;
    weight: "weighted" | "unweighted";
    connect: "and";
    guarantee: "guarantees" | "does not guarantee";
    closing: "the shortest path!";
  };
}

export interface IAnimationSpeedMap {
  fast: number;
  average: number;
  slow: number;
}
