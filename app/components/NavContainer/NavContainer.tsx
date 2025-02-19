"use client";

import React, { useCallback } from "react";
import { IGridState, INode } from "@/app/interfaces/interfaces";
import {
  AnimationSpeed,
  AvailableAlgorithms,
  AvailableMazes,
} from "@/app/types/types";
import { GridAction } from "../Grid/gridReducer";
import Nav from "../Nav/Nav";
import InfoBar from "../InfoBar/InfoBar";
import {
  clearPath,
  clearWallsAndWeights,
  doesBombExistInGrid,
  doesGridHaveWeights,
  generateMaze,
  placeRandomBomb,
  removeBomb,
  visualizeAlgorithm,
} from "@/app/utils/utils";
import {
  mazeGenerationSpeedMap,
  pathAnimationSpeedMap,
  visitedNodeAnimationSpeedMap,
} from "@/app/utils/lookupMaps";

interface INavContainerProps {
  navWrapperRef: HTMLDivElement | null;
  nodeSize: number;
  state: IGridState;
  dispatch: React.Dispatch<GridAction>;
  getInitialGrid: (rows: number, cols: number) => INode[][];
  calculateAndSetGridDimensions: (
    nodeSize: number,
    navWrapper: HTMLDivElement | null
  ) => void;
}

const NavContainer: React.FC<INavContainerProps> = ({
  navWrapperRef,
  nodeSize,
  state,
  dispatch,
  getInitialGrid,
  calculateAndSetGridDimensions,
}) => {
  const { selectedAlgorithm, grid, animationSpeed, isAlgoRunning } = state;

  const bombExist = doesBombExistInGrid(grid);
  const weightsExist = doesGridHaveWeights(grid);

  const handleVisualizeAlgorithm = useCallback(
    () => visualizeAlgorithm(state, dispatch),
    [dispatch, state]
  );

  const handleAlgorithmChange = (value: AvailableAlgorithms) => {
    // We cannot run Bidirectional Swarm Algorithm with a bomb
    if (value === "swarmBidirectional") removeBomb(state, dispatch);

    dispatch({ type: "SET_SELECTED_ALGORITHM", payload: value });
  };

  const handleMazeGeneration = useCallback(
    (maze: AvailableMazes) =>
      generateMaze(state, maze, dispatch, navWrapperRef, nodeSize),
    [dispatch, navWrapperRef, nodeSize, state]
  );

  const handleResetGrid = () => {
    const { gridDimensions } = state;
    const { rows, cols } = gridDimensions;

    dispatch({ type: "SET_BOMB_DEFUSE_STATE", payload: undefined });
    dispatch({ type: "SET_BOMB_NODE", payload: { row: -1, col: -1 } });

    if (rows > 0 && cols > 0) {
      dispatch({ type: "SET_GRID", payload: getInitialGrid(rows, cols) });
    }

    calculateAndSetGridDimensions(nodeSize, navWrapperRef);
  };

  const handleClearWallsAndWeights = () =>
    clearWallsAndWeights(state, dispatch);

  const handleClearPath = () => clearPath(dispatch);

  const handleSetAnimationSpeed = (speed: AnimationSpeed) => {
    const visitedAnimationSpeed = visitedNodeAnimationSpeedMap[speed];
    const pathAnimationSpeed = pathAnimationSpeedMap[speed];
    const mazeAnimationSpeed = mazeGenerationSpeedMap[speed];

    dispatch({
      type: "SET_ANIMATION_SPEED",
      payload: speed,
    });
    dispatch({
      type: "SET_VISITED_NODE_ANIMATION_SPEED",
      payload: visitedAnimationSpeed,
    });
    dispatch({
      type: "SET_PATH_NODE_ANIMATION_SPEED",
      payload: pathAnimationSpeed,
    });
    dispatch({
      type: "SET_MAZE_ANIMATION_SPEED",
      payload: mazeAnimationSpeed,
    });
  };

  return (
    <React.Fragment>
      <Nav
        menuItems={[
          {
            type: "button",
            name: "Visualize!",
            onClick: handleVisualizeAlgorithm,
          },
          {
            type: "dropdown",
            name: "Algorithm",
            value: selectedAlgorithm,
            children: [
              {
                type: "option",
                name: "Dijkstra's Algorithm",
                value: "dijkstras",
              },
              {
                type: "option",
                name: "A* Search",
                value: "astar",
              },
              {
                type: "option",
                name: "Bellman-Ford Algorithm",
                value: "bellmanFord",
              },
              {
                type: "option",
                name: "Greedy Best-First Search",
                value: "greedyBFS",
              },
              {
                type: "option",
                name: "Bidirectional Swarm",
                value: "swarmBidirectional",
              },
              {
                type: "option",
                name: "Breadth-First Search",
                value: "bfs",
              },
              {
                type: "option",
                name: "Depth-First Search",
                value: "dfs",
              },
            ],
            onChange: (value) =>
              handleAlgorithmChange(value as AvailableAlgorithms),
          },
          {
            type: "dropdown",
            name: "Mazes",
            value: "", // Keeps name prop as displayed select text
            children: [
              {
                type: "option",
                name: "Recursive Division",
                value: "recursiveDivision",
              },
              {
                type: "option",
                name: "Recursive Division (vertical skew)",
                value: "recursiveDivisionVerticalSkew",
              },
              {
                type: "option",
                name: "Recursive Division (horizontal skew)",
                value: "recursiveDivisionHorizontalSkew",
              },
              {
                type: "option",
                name: "Random Basic Maze",
                value: "randomBasicMaze",
              },
              {
                type: "option",
                name: "Basic Weight Maze",
                value: "basicWeightMaze",
              },
            ],
            onChange: (value) => {
              handleMazeGeneration(value as AvailableMazes);
            },
          },
          {
            type: "simpleButton",
            name: bombExist ? "Remove Bomb" : "Place Bomb",
            isDisabled: selectedAlgorithm === "swarmBidirectional",
            onClick: () =>
              bombExist
                ? removeBomb(state, dispatch)
                : placeRandomBomb(state, dispatch),
          },
          {
            type: "simpleButton",
            name: "Reset Grid",
            onClick: handleResetGrid,
          },
          {
            type: "simpleButton",
            name: "Clear Walls & Weights",
            onClick: handleClearWallsAndWeights,
          },
          {
            type: "simpleButton",
            name: "Clear Path",
            onClick: handleClearPath,
          },
          {
            type: "dropdown",
            name: "Animation Speed",
            value: animationSpeed,
            children: [
              { name: "Fast", value: "fast" },
              { name: "Average", value: "average" },
              { name: "Slow", value: "slow" },
            ],
            onChange: (value) => {
              handleSetAnimationSpeed(value as AnimationSpeed);
            },
            formatDisplayText: (selected) =>
              selected ? `Speed: ${selected.name}` : "Animation Speed",
          },
        ]}
        isAlgoRunning={isAlgoRunning}
      />
      <InfoBar
        nodeSize={nodeSize}
        selectedAlgorithm={selectedAlgorithm}
        bombExist={bombExist}
        weightExist={weightsExist}
      />
    </React.Fragment>
  );
};

export default NavContainer;
