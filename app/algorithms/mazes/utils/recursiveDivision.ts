import { INode } from "@/app/interfaces/interfaces";

interface MazeParams {
  grid: INode[][];
  startNode: INode;
  finishNode: INode;
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  orientation: "horizontal" | "vertical";
  walls: INode[];
  surroundingWalls: boolean;
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
  walls,
  surroundingWalls,
}: MazeParams): INode[] => {
  if (rowEnd < rowStart || colEnd < colStart) return walls;

  // Initialize surrounding walls (first call only)
  if (!surroundingWalls) {
    walls = grid.reduce((acc, row, rowIndex) => {
      row.forEach((node, colIndex) => {
        const isBorder =
          rowIndex === 0 ||
          colIndex === 0 ||
          rowIndex === grid.length - 1 ||
          colIndex === grid[0].length - 1;
        const isSpecial =
          (rowIndex === startNode.row && colIndex === startNode.col) ||
          (rowIndex === finishNode.row && colIndex === finishNode.col);
        if (isBorder && !isSpecial) acc.push(node);
      });
      return acc;
    }, [] as INode[]);
    surroundingWalls = true;
  }

  // Calculate maze dimensions based on your grid size calculation
  const isHorizontal = orientation === "horizontal";
  const wallRowCol = isHorizontal
    ? getRandomEven(rowStart, rowEnd)
    : getRandomEven(colStart, colEnd);
  const passageRowCol = isHorizontal
    ? getRandomOdd(colStart, colEnd)
    : getRandomOdd(rowStart, rowEnd);

  if (isHorizontal && wallRowCol !== undefined) {
    // Add horizontal wall
    for (let col = colStart; col <= colEnd; col++) {
      const node = grid[wallRowCol][col];
      if (
        col !== passageRowCol &&
        !isSpecialNode(node, startNode, finishNode)
      ) {
        walls.push(node);
      }
    }

    // Recurse with vertical orientation
    recursiveDivisionMaze({
      grid,
      startNode,
      finishNode,
      rowStart,
      rowEnd: wallRowCol - 2,
      colStart,
      colEnd,
      orientation: "vertical",
      walls,
      surroundingWalls,
    });

    recursiveDivisionMaze({
      grid,
      startNode,
      finishNode,
      rowStart: wallRowCol + 2,
      rowEnd,
      colStart,
      colEnd,
      orientation: "vertical",
      walls,
      surroundingWalls,
    });
  } else if (!isHorizontal && wallRowCol !== undefined) {
    // Add vertical wall
    for (let row = rowStart; row <= rowEnd; row++) {
      const node = grid[row][wallRowCol];
      if (
        row !== passageRowCol &&
        !isSpecialNode(node, startNode, finishNode)
      ) {
        walls.push(node);
      }
    }

    // Recurse with horizontal orientation
    recursiveDivisionMaze({
      grid,
      startNode,
      finishNode,
      rowStart,
      rowEnd,
      colStart,
      colEnd: wallRowCol - 2,
      orientation: "horizontal",
      walls,
      surroundingWalls,
    });

    recursiveDivisionMaze({
      grid,
      startNode,
      finishNode,
      rowStart,
      rowEnd,
      colStart: wallRowCol + 2,
      colEnd,
      orientation: "horizontal",
      walls,
      surroundingWalls,
    });
  }

  return walls;
};

// Helpers
const getRandomEven = (min: number, max: number): number => {
  const evenNumbers = Array.from(
    { length: Math.floor((max - min) / 2) + 1 },
    (_, i) => min + i * 2
  );
  return evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
};

const getRandomOdd = (min: number, max: number): number => {
  const oddNumbers = Array.from(
    { length: Math.ceil((max - min) / 2) },
    (_, i) => min + i * 2 + 1
  );
  return oddNumbers[Math.floor(Math.random() * oddNumbers.length)];
};

const isSpecialNode = (node: INode, ...specials: INode[]): boolean => {
  return specials.some((s) => s.row === node.row && s.col === node.col);
};
