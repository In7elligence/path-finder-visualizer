import { IAnimationSpeedMap } from "../interfaces/interfaces";

export const pathAnimationSpeedMap: IAnimationSpeedMap = {
  fast: 50,
  average: 75,
  slow: 100,
};

export const visitedNodeAnimationSpeedMap: IAnimationSpeedMap = {
  fast: 10,
  average: 25,
  slow: 50,
};

export const mazeGenerationSpeedMap: IAnimationSpeedMap = {
  fast: 4000,
  average: 10000,
  slow: 15000,
};
