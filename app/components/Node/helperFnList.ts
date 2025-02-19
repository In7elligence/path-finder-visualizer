import { INodeProps } from "./Node";

type NodeState = Pick<
  INodeProps,
  | "isFinish"
  | "isShortestPath"
  | "bombExist"
  | "direction"
  | "weight"
  | "isStart"
  | "isBomb"
  | "isBombDefused"
  | "isWall"
  | "isMazeWall"
  | "isBlueVisited"
  | "isPurpleVisited"
  | "isMousePressed"
>;

/*! 
 * This still isn't great for maintainability...
 *
 * The logic sort of has to be thought of in reverse.
 * What is the last case logic and work your way down
 * from that to the first case logic. This is because
 * order of specificity matters.
!*/
export const getNodeClasses = (state: NodeState): string => {
  const conditions = [
    {
      test: ({ isFinish, isShortestPath, bombExist, isBombDefused, direction } = state) =>
        isFinish && isShortestPath && bombExist && isBombDefused && direction,
      classes: "node-robot node-shortest-path",
    },
    {
      test: ({ isShortestPath, direction, bombExist } = state) =>
        isShortestPath && !!direction && bombExist,
      classes: "node-robot",
    },
    {
      test: ({ isShortestPath, direction } = state) =>
        isShortestPath && !!direction,
      classes: ({ direction } = state) =>
        `node-shortest-path node-arrow-${direction}`,
    },
    {
      test: ({ isFinish, isShortestPath } = state) =>
        isFinish && isShortestPath,
      classes: "node-finish node-shortest-path",
    },
    {
      test: ({ isFinish, isBlueVisited } = state) => isFinish && isBlueVisited,
      classes: "node-finish node-visited",
    },
    {
      test: ({ isFinish, bombExist, isPurpleVisited } = state) =>
        isFinish && bombExist && isPurpleVisited,
      classes: "node-finish visited-while-bomb-active",
    },
    {
      test: ({ isFinish } = state) => isFinish,
      classes: "node-finish",
    },
    {
      test: ({ isStart, bombExist, isShortestPath } = state) =>
        isStart && bombExist && isShortestPath,
      classes: "node-robot node-shortest-path",
    },
    {
      test: ({ isStart, bombExist, isBlueVisited } = state) =>
        isStart && bombExist && isBlueVisited,
      classes: "node-robot node-visited",
    },
    {
      test: ({ isStart, bombExist, isPurpleVisited } = state) =>
        isStart && bombExist && isPurpleVisited,
      classes: "node-robot visited-while-bomb-active",
    },
    {
      test: ({ isStart, bombExist } = state) => isStart && bombExist,
      classes: "node-robot",
    },
    {
      test: ({ isStart, isShortestPath } = state) => isStart && isShortestPath,
      classes: "node-start node-shortest-path",
    },
    {
        test: ({ isStart, isBlueVisited } = state) => isStart && isBlueVisited,
        classes: "node-start node-visited",
      },
    {
      test: ({ isStart } = state) => isStart,
      classes: "node-start",
    },
    {
      test: ({ isBomb, isBombDefused, isShortestPath } = state) =>
        isBomb && isBombDefused && isShortestPath,
      classes: "node-bomb defused-bomb node-shortest-path",
    },
    {
      test: ({ isBomb, isBlueVisited } = state) => isBomb && isBlueVisited,
      classes: "node-bomb node-visited",
    },
    {
      test: ({ isBomb, isPurpleVisited } = state) => isBomb && isPurpleVisited,
      classes: "node-bomb visited-while-bomb-active",
    },
    {
      test: ({ isBomb } = state) => isBomb,
      classes: "node-bomb",
    },
    {
      test: ({ weight, isShortestPath } = state) => weight > 1 && isShortestPath,
      classes: "node-weight node-shortest-path",
    },
    {
      test: ({ weight, isBlueVisited } = state) => weight > 1 && isBlueVisited,
      classes: "node-weight node-visited",
    },
    {
      test: ({ weight, isPurpleVisited } = state) => weight > 1 && isPurpleVisited,
      classes: "node-weight visited-while-bomb-active",
    },
    {
      test: ({ weight } = state) => weight > 1,
      classes: "node-weight",
    },
    {
      test: ({ isWall, isMazeWall } = state) => isWall && isMazeWall,
      classes: "node-wall maze-wall",
    },
    {
      test: ({ isWall } = state) => isWall,
      classes: "node-wall",
    },
    {
      test: ({ isMazeWall } = state) => isMazeWall,
      classes: "maze-wall",
    },
    {
      test: ({ isShortestPath } = state) => isShortestPath,
      classes: "node-shortest-path",
    },
    {
      test: ({ isBlueVisited } = state) => isBlueVisited,
      classes: "node-visited",
    },
    {
      test: ({ isPurpleVisited } = state) => isPurpleVisited,
      classes: "visited-while-bomb-active",
    },
    {
      test: ({ isStart, isFinish, isMousePressed } = state) =>
        (isStart || isFinish) && isMousePressed,
      classes: "node-dragging-disabled",
    },
  ];

  const matchedCondition = conditions.find((condition) =>
    condition.test(state)
  );

  if (!matchedCondition) return "";

  return typeof matchedCondition.classes === "function"
    ? matchedCondition.classes(state)
    : matchedCondition.classes;
};
