export type SpecialNode = "start" | "finish" | "bomb";
export type NodeDirection = "up" | "down" | "left" | "right" | undefined;
export type NavItemType =
  | "button"
  | "simpleButton"
  | "helpButton"
  | "dropdown"
  | "option"
  | "githubButton";
export type AvailableAlgorithms =
  | "dijkstras"
  | "astar"
  | "bellmanford"
  | "greedyBFS"
  | "swarmBidirectional"
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
