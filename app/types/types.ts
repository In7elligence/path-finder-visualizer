export type NodeDirection = "up" | "down" | "left" | "right" | undefined;
export type NavItemType = "simpleButton" | "button" | "dropdown" | "option";
export type AvailableAlgorithms = "dijkstras" | "astar" | "greedyBFS" | "bfs" | "dfs";
export type AvailableMazes =
  | "randomBasicMaze"
  | "recursiveDivision"
  | "recursiveDivisionVerticalSkew"
  | "recursiveDivisionHorizontalSkew";
export type RecursiveDivisions = "horizontal" | "vertical";
