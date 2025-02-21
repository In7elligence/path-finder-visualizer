import { INode } from "@/app/interfaces/interfaces";

export const recursiveDivision = (
  grid: INode[][],
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  orientation: "horizontal" | "vertical",
  walls: INode[],
  horizontalBias: number = 0.5,
): void => {
  // Base case: stop when region too small
  if (endRow - startRow < 1 || endCol - startCol < 1) return;

  const isHorizontal = orientation === "horizontal";
  const wallPosition = Math.floor(
    startRow + (endRow - startRow) * horizontalBias,
  );
  const passagePosition =
    startCol + Math.floor(Math.random() * (endCol - startCol + 1));

  // Generate wall with single passage
  for (let i = startCol; i <= endCol; i++) {
    if (isHorizontal) {
      const node = grid[wallPosition][i];
      if (
        i !== passagePosition &&
        !node.isStart &&
        !node.isFinish &&
        !node.isBomb
      ) {
        walls.push(node);
      }
    }
  }

  for (let i = startRow; i <= endRow; i++) {
    if (!isHorizontal) {
      const node = grid[i][wallPosition];
      if (
        i !== passagePosition &&
        !node.isStart &&
        !node.isFinish &&
        !node.isBomb
      ) {
        walls.push(node);
      }
    }
  }

  // Alternate orientation with probability-based direction
  const newOrientation = Math.random() > 0.5 ? "horizontal" : "vertical";

  // Recurse with adjusted regions
  if (isHorizontal) {
    recursiveDivision(
      grid,
      startRow,
      wallPosition - 1,
      startCol,
      endCol,
      newOrientation,
      walls,
      0.5,
    );
    recursiveDivision(
      grid,
      wallPosition + 1,
      endRow,
      startCol,
      endCol,
      newOrientation,
      walls,
      0.5,
    );
  } else {
    recursiveDivision(
      grid,
      startRow,
      endRow,
      startCol,
      wallPosition - 1,
      newOrientation,
      walls,
      0.5,
    );
    recursiveDivision(
      grid,
      startRow,
      endRow,
      wallPosition + 1,
      endCol,
      newOrientation,
      walls,
      0.5,
    );
  }
};

// Ensure the maze is solvable (not particularly used or reliable)
export const ensureSolvability = (
  grid: INode[][],
  _start: INode,
  _finish: INode,
  walls: INode[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bomb?: INode,
): INode[] => {
  return walls.filter((wall) => !grid[wall.row][wall.col].isPath);
};

export const getGridCorners = (
  grid: INode[][],
): { row: number; col: number }[] => {
  const lastRow = grid.length - 1;
  const lastCol = grid[0].length - 1;

  return [
    { row: 0, col: 0 }, // Top-left
    { row: 0, col: lastCol }, // Top-right
    { row: lastRow, col: 0 }, // Bottom-left
    { row: lastRow, col: lastCol }, // Bottom-right
  ];
};

export const protectCornerNodes = (
  grid: INode[][],
  startNode: INode,
  finishNode: INode,
) => {
  const corners = getGridCorners(grid);
  const protectedNodes = [startNode, finishNode].filter((node) =>
    corners.some(
      (corner) => corner.row === node.row && corner.col === node.col,
    ),
  );

  protectedNodes.forEach(({ row, col }) => {
    // Clear adjacent nodes in 2x2 area
    const adjacentNodes = [
      { row: row, col: col + 1 },
      { row: row + 1, col: col },
      { row: row + 1, col: col + 1 },
    ].filter((pos) => pos.row < grid.length && pos.col < grid[0].length);

    adjacentNodes.forEach(({ row, col }) => {
      grid[row][col].isWall = false;
      grid[row][col].isMazeWall = false;
    });
  });
};

export const recursiveDivisionMaze = (
  grid: INode[][],
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  orientation: "horizontal" | "vertical",
  walls: INode[],
  surroundingWalls: boolean,
  startNode: INode,
  finishNode: INode,
): void => {
  if (endRow < startRow || endCol < startCol) return;

  // Initialize surrounding walls on first call
  if (!surroundingWalls) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          row === 0 ||
          col === 0 ||
          row === grid.length - 1 ||
          col === grid[0].length - 1
        ) {
          if (
            !(row === startNode.row && col === startNode.col) &&
            !(row === finishNode.row && col === finishNode.col)
          ) {
            walls.push(grid[row][col]);
          }
        }
      }
    }
    surroundingWalls = true;
  }

  if (orientation === "horizontal") {
    const possibleRows = [];
    for (let row = startRow; row <= endRow; row += 2) {
      possibleRows.push(row);
    }

    const possibleCols = [];
    for (let col = startCol - 1; col <= endCol + 1; col += 2) {
      possibleCols.push(col);
    }

    const randomRow =
      possibleRows[Math.floor(Math.random() * possibleRows.length)];
    const randomCol =
      possibleCols[Math.floor(Math.random() * possibleCols.length)];

    if (randomRow === undefined || randomCol === undefined) return;

    for (let col = startCol - 1; col <= endCol + 1; col++) {
      if (
        col !== randomCol &&
        grid[randomRow]?.[col] &&
        !isSpecialNode(grid[randomRow][col], startNode, finishNode)
      ) {
        walls.push(grid[randomRow][col]);
      }
    }

    if (randomRow - 2 - startRow > endCol - startCol) {
      recursiveDivisionMaze(
        grid,
        startRow,
        randomRow - 2,
        startCol,
        endCol,
        "horizontal",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    } else {
      recursiveDivisionMaze(
        grid,
        startRow,
        randomRow - 2,
        startCol,
        endCol,
        "vertical",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    }

    if (endRow - (randomRow + 2) > endCol - startCol) {
      recursiveDivisionMaze(
        grid,
        randomRow + 2,
        endRow,
        startCol,
        endCol,
        "horizontal",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    } else {
      recursiveDivisionMaze(
        grid,
        randomRow + 2,
        endRow,
        startCol,
        endCol,
        "vertical",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    }
  } else {
    const possibleCols = [];
    for (let col = startCol; col <= endCol; col += 2) {
      possibleCols.push(col);
    }

    const possibleRows = [];
    for (let row = startRow - 1; row <= endRow + 1; row += 2) {
      possibleRows.push(row);
    }

    const randomCol =
      possibleCols[Math.floor(Math.random() * possibleCols.length)];
    const randomRow =
      possibleRows[Math.floor(Math.random() * possibleRows.length)];

    if (randomCol === undefined || randomRow === undefined) return;

    for (let row = startRow - 1; row <= endRow + 1; row++) {
      if (
        row !== randomRow &&
        grid[row]?.[randomCol] &&
        !isSpecialNode(grid[row][randomCol], startNode, finishNode)
      ) {
        walls.push(grid[row][randomCol]);
      }
    }

    if (endRow - startRow > randomCol - 2 - startCol) {
      recursiveDivisionMaze(
        grid,
        startRow,
        endRow,
        startCol,
        randomCol - 2,
        "horizontal",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    } else {
      recursiveDivisionMaze(
        grid,
        startRow,
        endRow,
        startCol,
        randomCol - 2,
        "vertical",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    }

    if (endRow - startRow > endCol - (randomCol + 2)) {
      recursiveDivisionMaze(
        grid,
        startRow,
        endRow,
        randomCol + 2,
        endCol,
        "horizontal",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    } else {
      recursiveDivisionMaze(
        grid,
        startRow,
        endRow,
        randomCol + 2,
        endCol,
        "vertical",
        walls,
        surroundingWalls,
        startNode,
        finishNode,
      );
    }
  }
};

const isSpecialNode = (node: INode, ...specialNodes: INode[]) => {
  return specialNodes.some(
    (special) => special.row === node.row && special.col === node.col,
  );
};
