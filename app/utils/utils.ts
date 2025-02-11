import { INode } from "../interfaces/interfaces";

export const getNewGridWithWallToggled = (
    grid: INode[][],
    row: number,
    col: number
  ): INode[][] => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;

    return newGrid;
  };