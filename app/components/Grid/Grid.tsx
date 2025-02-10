"use client";

import React, { useReducer, useEffect, useCallback } from "react";
import "./grid.css";
import { INode } from "@/app/interfaces/interfaces";
import Node from "../Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "@/app/algorithms/dijkstras";
import { NODE_SIZE, ANIMATION_DURATION } from "@/app/constants/constants";
import { initialGridState } from "./initialState";
import { gridReducer } from "./gridReducer";

const Grid: React.FC = () => {
  const [state, dispatch] = useReducer(gridReducer, initialGridState);

  // Calculate grid dimensions based on available screen size
  const calculateGridDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const cols = Math.floor(width / NODE_SIZE) - 1; // -1 to account for potential overflow
    const rows = Math.floor(height / NODE_SIZE) - 1; // -1 to account for potential overflow

    return { rows, cols };
  };

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

  const getNewGridWithWallToggled = (
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

          // Return the node as-is
          return node;
        })
      );

      // Update the grid state
      dispatch({ type: "SET_GRID", payload: newGrid });

      // Update the start or finish node position in the state
      if (isStart) {
        dispatch({ type: "SET_START_NODE", payload: { row, col } });
      } else {
        dispatch({ type: "SET_FINISH_NODE", payload: { row, col } });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.grid, state.startNode, state.finishNode]
  );

  const visualizeDijkstra = () => {
    const { grid, startNode, finishNode } = state;

    dispatch({ type: "TOGGLE_ALGO", payload: true });

    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];

    const visitedNodesInOrder = dijkstra(grid, start, finish);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);

    // Calculate total animation time
    const totalAnimationTime =
      visitedNodesInOrder.length * ANIMATION_DURATION + // Time for visited nodes
      nodesInShortestPathOrder.length * ANIMATION_DURATION; // Time for shortest path nodes

    // Animate visited nodes
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        dispatch({
          type: "SET_VISITED_NODES",
          payload: visitedNodesInOrder.slice(0, i + 1),
        });
      }, ANIMATION_DURATION * i);
    }

    // Animate shortest path nodes one at a time
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        // Update the shortest path nodes to include only the current node
        dispatch({
          type: "SET_NODES_IN_SHORTEST_PATH",
          payload: nodesInShortestPathOrder.slice(0, i + 1),
        });
      }, visitedNodesInOrder.length * ANIMATION_DURATION + i * ANIMATION_DURATION);
    }

    // Set algorithm running state to false after all animations are complete
    setTimeout(() => {
      dispatch({ type: "TOGGLE_ALGO", payload: false });
    }, totalAnimationTime);
  };

  // Initialize grid dimensions and nodes on mount
  useEffect(() => {
    const { rows, cols } = calculateGridDimensions();
    dispatch({ type: "SET_GRID_DIMENSIONS", payload: { rows, cols } });
    positionStartAndEndNodes(rows, cols);
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
      const { rows, cols } = calculateGridDimensions();
      dispatch({ type: "SET_GRID_DIMENSIONS", payload: { rows, cols } });
      positionStartAndEndNodes(rows, cols);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    grid,
    gridDimensions,
    visitedNodes,
    nodesInShortestPath,
    isAlgoRunning,
  } = state;

  return (
    <React.Fragment>
      <button onClick={visualizeDijkstra}>
        Visualize Dijkstra&lsquo;s Algorithm
      </button>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, ${NODE_SIZE}px)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, ${NODE_SIZE}px)`,
        }}
      >
        {grid.map((row, rowIdx) => {
          return (
            <React.Fragment key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall, direction } = node;
                const isVisited = visitedNodes.includes(node);
                const isShortestPath = nodesInShortestPath.includes(node);

                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    isVisited={isVisited}
                    isShortestPath={isShortestPath}
                    isAlgoRunning={isAlgoRunning}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    onDropNode={handleDropNode}
                    row={row}
                    direction={direction}
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
