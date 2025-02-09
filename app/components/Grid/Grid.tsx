"use client";

import React, { useState, useEffect, useCallback } from "react";
import "./grid.css";
import { INode } from "@/app/interfaces/interfaces";
import Node from "../Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "@/app/algorithms/dijkstras";

interface IState {
  grid: INode[][];
  isMousePressed: boolean;
}

const Grid: React.FC = () => {
  const [state, setState] = useState<IState>({
    grid: [[]],
    isMousePressed: false,
  });
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });
  const [startNode, setStartNode] = useState({ row: 0, col: 0 });
  const [finishNode, setFinishNode] = useState({ row: 0, col: 0 });
  const [visitedNodes, setVisitedNodes] = useState<INode[]>([]);
  const [nodesInShortestPath, setNodesInShortestPath] = useState<INode[]>([]);

  const NODE_SIZE = 25; // Size of each node in pixels

  // Calculate grid dimensions based on available screen size
  const calculateGridDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const cols = Math.floor(width / NODE_SIZE);
    const rows = Math.floor(height / NODE_SIZE);

    return { rows, cols };
  };

  // Position start and end nodes dynamically
  const positionStartAndEndNodes = (rows: number, cols: number) => {
    const startRow = Math.floor(rows / 2); // Center row
    const startCol = 2; // 2 columns from the left
    const finishRow = Math.floor(rows / 2); // Center row
    const finishCol = cols - 3; // 2 columns from the right

    setStartNode({ row: startRow, col: startCol });
    setFinishNode({ row: finishRow, col: finishCol });
  };

  const createNode = (col: number, row: number): INode => {
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
      const { grid } = state;
      const newGrid = getNewGridWithWallToggled(grid, row, col);

      setState((prevState) => ({
        ...prevState,
        grid: newGrid,
        isMousePressed: true,
      }));
    },
    [state]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!state.isMousePressed) return;

      const newGrid = getNewGridWithWallToggled(state.grid, row, col);
      setState((prevState) => ({
        ...prevState,
        grid: newGrid,
      }));
    },
    [state.grid, state.isMousePressed]
  );

  const handleMouseUp = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isMousePressed: false,
    }));
  }, []);

  const visualizeDijkstra = () => {
    console.log("visualizing dijkstra");
    const { grid } = state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];

    const visitedNodesInOrder = dijkstra(grid, start, finish);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);

    // Animate visited nodes
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder?.length) {
        setTimeout(() => {
          // Animate shortest path after visited nodes are done
          setNodesInShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        setVisitedNodes((prevVisitedNodes) => [
          ...prevVisitedNodes,
          visitedNodesInOrder[i],
        ]);
      }, 10 * i);
    }
  };

  // Initialize grid dimensions and nodes on mount
  useEffect(() => {
    const { rows, cols } = calculateGridDimensions();
    setGridDimensions({ rows, cols });
    positionStartAndEndNodes(rows, cols);
  }, []);

  // Recreate the grid when dimensions or nodes change
  useEffect(() => {
    const { rows, cols } = gridDimensions;
    if (rows > 0 && cols > 0) {
      setState((prevState) => ({
        ...prevState,
        grid: getInitialGrid(rows, cols),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridDimensions, startNode, finishNode]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const { rows, cols } = calculateGridDimensions();
      setGridDimensions({ rows, cols });
      positionStartAndEndNodes(rows, cols);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {state.grid.map((row, rowIdx) => {
          return (
            <React.Fragment key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
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
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    row={row}
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
