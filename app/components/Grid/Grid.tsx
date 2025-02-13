"use client";

import React, { useReducer, useEffect, useCallback, useState } from "react";
import "./grid.css";
import Node from "../Node/Node";
import { initialGridState } from "./initialState";
import { gridReducer } from "./gridReducer";
import { visualizeDijkstras } from "@/app/algorithms/dijkstras/animation/visualizeDijkstras";
import { visualizeAstar } from "@/app/algorithms/astar/animation/visualizeAstar";
import {
  calculateGridDimensions,
  getNewGridWithWallToggled,
  getNodeSize,
} from "@/app/utils/utils";
import { AvailableAlgorithms, AvailableMazes } from "@/app/types/types";
import { NODE_SIZE } from "@/app/constants/constants";
import { visualizeRandomBasicMaze } from "@/app/algorithms/mazes/animations/randomBasicMaze";
import { visualizeRecursiveDivision } from "@/app/algorithms/mazes/animations/recursiveDivisionMaze";
import { removeWallsFromGrid } from "@/app/algorithms/utils/utils";
import Nav from "../Nav/Nav";
import { visualizeGreedyBFS } from "@/app/algorithms/greedyBFS/animation/visualizeGreedyBFS";
import { visualizeBFS } from "@/app/algorithms/bfs/animation/visualizeBFS";
import { visualizeDFS } from "@/app/algorithms/dfs/animation/visualizeDFS";

const Grid: React.FC = () => {
  const [state, dispatch] = useReducer(gridReducer, initialGridState);
  const [nodeSize, setNodeSize] = useState(NODE_SIZE);

  // Calculate grid dimensions based on available screen size
  const calculateAndSetGridDimensions = useCallback((nodeSize: number) => {
    const { rows, cols } = calculateGridDimensions(nodeSize);
    dispatch({ type: "SET_GRID_DIMENSIONS", payload: { rows, cols } });
    positionStartAndEndNodes(rows, cols);
  }, []);

  // Position start and end nodes dynamically
  const positionStartAndEndNodes = (rows: number, cols: number) => {
    const startRow = Math.floor(rows / 2); // Center row
    const startCol = 2; // 2 columns from the left
    const finishRow = Math.floor(rows / 2); // Center row
    const finishCol = cols - 3; // 2 columns from the right

    dispatch({
      type: "SET_START_NODE",
      payload: { row: startRow, col: startCol },
    });
    dispatch({
      type: "SET_FINISH_NODE",
      payload: { row: finishRow, col: finishCol },
    });
  };

  const createNode = (col: number, row: number) => {
    const { startNode, finishNode } = state;
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isMazeWall: false,
      previousNode: null,
    };
  };

  const getInitialGrid = (rows: number, cols: number) => {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }

    return grid;
  };

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      const { startNode, finishNode } = state;
      const { row: startRow, col: startCol } = startNode;
      const { row: finishRow, col: finishCol } = finishNode;

      if (
        (row === startRow && col === startCol) ||
        (row === finishRow && col === finishCol)
      ) {
        return;
      }

      const { grid } = state;
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      dispatch({ type: "SET_GRID", payload: newGrid });
      dispatch({ type: "TOGGLE_MOUSE_PRESSED", payload: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.grid]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      const { isMousePressed, grid } = state;
      if (!isMousePressed) return;

      const newGrid = getNewGridWithWallToggled(grid, row, col);
      dispatch({ type: "SET_GRID", payload: newGrid });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.isMousePressed, state.grid]
  );

  const handleMouseUp = useCallback(() => {
    dispatch({ type: "TOGGLE_MOUSE_PRESSED", payload: false });
  }, []);

  const handleDropNode = useCallback(
    (row: number, col: number, isStart: boolean) => {
      const { grid, startNode, finishNode } = state;

      // Ensure the drop target is not a wall
      if (grid[row][col].isWall) return;

      // Ensure the start and finish nodes are not the same
      if (isStart && row === finishNode.row && col === finishNode.col) return;
      if (!isStart && row === startNode.row && col === startNode.col) return;

      // Create a new grid with the updated start/finish node positions
      const newGrid = grid.map((rowNodes, rowIdx) =>
        rowNodes.map((node, colIdx) => {
          // Reset the original start/finish node position
          if (node.isStart && isStart) {
            return { ...node, isStart: false };
          }
          if (node.isFinish && !isStart) {
            return { ...node, isFinish: false };
          }

          // Set the new start/finish node position
          if (rowIdx === row && colIdx === col) {
            return {
              ...node,
              isStart: isStart,
              isFinish: !isStart,
            };
          }

          // Preserve the other node (start or finish)
          if (node.isStart && !isStart) {
            return { ...node, isStart: true, isFinish: false };
          }
          if (node.isFinish && isStart) {
            return { ...node, isStart: false, isFinish: true };
          }

          return node;
        })
      );

      dispatch({ type: "SET_GRID", payload: newGrid });

      if (isStart) {
        dispatch({ type: "SET_START_NODE", payload: { row, col } });
      } else {
        dispatch({ type: "SET_FINISH_NODE", payload: { row, col } });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.grid, state.startNode, state.finishNode]
  );

  const handleAlgorithmChange = (value: AvailableAlgorithms) => {
    dispatch({ type: "SET_SELECTED_ALGORITHM", payload: value });
  };

  const handleVisualizeAlgorithm = useCallback(() => {
    const { selectedAlgorithm } = state;

    switch (selectedAlgorithm) {
      case "dijkstras":
        visualizeDijkstras(state, dispatch);
        break;
      case "astar":
        visualizeAstar(state, dispatch);
        break;
      case "greedyBFS":
        visualizeGreedyBFS(state, dispatch);
        break;
      case "bfs":
        visualizeBFS(state, dispatch);
        break;
      case "dfs":
        visualizeDFS(state, dispatch);
        break;
      default:
        visualizeDijkstras(state, dispatch);
    }
  }, [state]);

  const handleMazeGeneration = (maze: AvailableMazes) => {
    switch (maze) {
      case "randomBasicMaze":
        visualizeRandomBasicMaze(state, dispatch);
        break;
      case "recursiveDivision":
        visualizeRecursiveDivision(state, dispatch);
        break;
      case "recursiveDivisionVerticalSkew":
        visualizeRecursiveDivision(state, dispatch, "vertical");
        break;
      case "recursiveDivisionHorizontalSkew":
        visualizeRecursiveDivision(state, dispatch, "horizontal");
        break;
      default:
        visualizeRecursiveDivision(state, dispatch);
    }
  };

  const handleResetGrid = () => {
    const { gridDimensions } = state;
    const { rows, cols } = gridDimensions;

    if (rows > 0 && cols > 0) {
      dispatch({ type: "SET_GRID", payload: getInitialGrid(rows, cols) });
    }

    calculateAndSetGridDimensions(nodeSize);
  };

  const handleClearWalls = () => {
    const { grid } = state;

    const newGrid = removeWallsFromGrid(grid);

    dispatch({ type: "SET_GRID", payload: newGrid });
  };

  const handleClearPath = () => {
    dispatch({ type: "SET_NODES_IN_SHORTEST_PATH", payload: [] });
    dispatch({ type: "SET_VISITED_NODES", payload: [] });
  };

  // Initialize grid dimensions and nodes on mount
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const initNodeSize = getNodeSize(width, height); // Calculate node size on the client

    setNodeSize(initNodeSize);
    calculateAndSetGridDimensions(initNodeSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recreate the grid when dimensions or nodes change
  useEffect(() => {
    const { gridDimensions } = state;
    const { rows, cols } = gridDimensions;
    if (rows > 0 && cols > 0) {
      dispatch({ type: "SET_GRID", payload: getInitialGrid(rows, cols) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gridDimensions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const newNodeSize = getNodeSize(width, height); // Recalculate node size on resize
      setNodeSize(newNodeSize);
      calculateAndSetGridDimensions(newNodeSize);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateAndSetGridDimensions]);

  const {
    grid,
    gridDimensions,
    visitedNodes,
    nodesInShortestPath,
    isAlgoRunning,
    selectedAlgorithm,
  } = state;

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
                name: "Greedy Best-First Search",
                value: "greedyBFS",
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
            onClick: () => {},
          },
          {
            type: "dropdown",
            name: "Mazes",
            value: "",
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
            ],
            onClick: (value) => handleMazeGeneration(value as AvailableMazes),
          },
          {
            type: "simpleButton",
            name: "Reset Grid",
            onClick: handleResetGrid,
          },
          {
            type: "simpleButton",
            name: "Clear Walls",
            onClick: handleClearWalls,
          },
          {
            type: "simpleButton",
            name: "Clear Path",
            onClick: handleClearPath,
          },
        ]}
        isAlgoRunning={isAlgoRunning}
        onAlgorithmChange={handleAlgorithmChange}
      />
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, ${nodeSize}px)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, ${nodeSize}px)`,
        }}
      >
        {grid.map((row, rowIdx) => {
          return (
            <React.Fragment key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {
                  row,
                  col,
                  isFinish,
                  isStart,
                  isWall,
                  isMazeWall,
                  direction,
                } = node;
                const isVisited = visitedNodes.includes(node);
                const isShortestPath = nodesInShortestPath.includes(node);

                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    isMazeWall={isMazeWall}
                    isVisited={isVisited}
                    isShortestPath={isShortestPath}
                    isAlgoRunning={isAlgoRunning}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    onDropNode={handleDropNode}
                    row={row}
                    direction={direction}
                    nodeSize={nodeSize}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Grid;
