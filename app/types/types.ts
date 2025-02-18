export type SpecialNode = "start" | "finish" | "bomb";
export type NodeDirection = "up" | "down" | "left" | "right" | undefined;
export type NavItemType = "button" | "simpleButton" | "dropdown" | "option";
export type AvailableAlgorithms =
  | "dijkstras"
  | "astar"
  | "greedyBFS"
  | "bfs"
  | "dfs";
export type AvailableMazes =
  | "randomBasicMaze"
  | "basicWeightMaze"
  | "recursiveDivision"
  | "recursiveDivisionVerticalSkew"
  | "recursiveDivisionHorizontalSkew";
export type RecursiveDivisions = "horizontal" | "vertical";
export type AnimationSpeed = "fast" | "average" | "slow";