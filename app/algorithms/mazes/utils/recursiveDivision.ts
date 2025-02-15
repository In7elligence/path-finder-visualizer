import { INode } from "@/app/interfaces/interfaces";

export type Orientation = "horizontal" | "vertical";

export interface MazeParams {
  grid: INode[][];
  startNode: INode;
  finishNode: INode;
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  orientation: Orientation;
  surroundingWalls: boolean;
  bombNode?: INode;
  walls?: INode[];
}

export const recursiveDivisionMaze = ({
  grid,
  startNode,
  finishNode,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  orientation,
  walls: initWalls,
  bombNode,
  surroundingWalls,
}: MazeParams) => {
  const walls = initWalls || [];

  if (rowEnd < rowStart || colEnd < colStart) return walls;

  if (!surroundingWalls) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          (row === 0 ||
            col === 0 ||
            row === grid.length - 1 ||
            col === grid[0].length - 1) &&
          grid[row][col] !== startNode &&
          grid[row][col] !== finishNode &&
          grid[row][col] !== bombNode
        ) {
          walls.push(grid[row][col]);
        }
      }
    }
    surroundingWalls = true;
  }

  const isHorizontal = orientation === "horizontal";

  const possibleWalls = [];
  const possibleGaps = [];

  if (isHorizontal) {
    for (let row = rowStart + 1; row <= rowEnd - 1; row += 2) {
      possibleWalls.push(row);
    }
    for (let col = colStart; col <= colEnd; col += 2) {
      possibleGaps.push(col);
    }
  } else {
    for (let col = colStart + 1; col <= colEnd - 1; col += 2) {
      possibleWalls.push(col);
    }
    for (let row = rowStart; row <= rowEnd; row += 2) {
      possibleGaps.push(row);
    }
  }

  if (possibleWalls.length === 0 || possibleGaps.length === 0) return walls;

  const chosenWall =
    possibleWalls[Math.floor(Math.random() * possibleWalls.length)];

  const gapOptions = possibleGaps.filter((g) => g !== colStart && g !== colEnd);
  const chosenGap = gapOptions.length
    ? gapOptions[Math.floor(Math.random() * gapOptions.length)]
    : possibleGaps[Math.floor(Math.random() * possibleGaps.length)];

  for (
    let i = isHorizontal ? colStart : rowStart;
    i <= (isHorizontal ? colEnd : rowEnd);
    i++
  ) {
    const wallNode = isHorizontal ? grid[chosenWall][i] : grid[i][chosenWall];

    if (
      wallNode === startNode ||
      wallNode === finishNode ||
      wallNode === bombNode ||
      i === chosenGap
    )
      continue;

    walls.push(wallNode);
  }

  const newOrientation =
    rowEnd - rowStart > colEnd - colStart ? "horizontal" : "vertical";

  recursiveDivisionMaze({
    grid,
    startNode,
    finishNode,
    bombNode,
    rowStart,
    rowEnd: isHorizontal ? chosenWall - 1 : rowEnd,
    colStart,
    colEnd: isHorizontal ? colEnd : chosenWall - 1,
    orientation: newOrientation,
    walls,
    surroundingWalls,
  });

  recursiveDivisionMaze({
    grid,
    startNode,
    finishNode,
    bombNode,
    rowStart: isHorizontal ? chosenWall + 1 : rowStart,
    rowEnd,
    colStart: isHorizontal ? colStart : chosenWall + 1,
    colEnd,
    orientation: newOrientation,
    walls,
    surroundingWalls,
  });

  return walls;
};
