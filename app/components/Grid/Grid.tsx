"use client";

import React, {
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import "./grid.css";
import Node from "../Node/Node";
import { initialGridState } from "./initialState";
import { gridReducer } from "./gridReducer";
import {
  calculateGridDimensions,
  doesBombExistInGrid,
  getNewGridWithWallToggled,
  getNewGridWithWeightToggled,
  getNodeSize,
} from "@/app/utils/utils";
import { SpecialNode } from "@/app/types/types";
import { NODE_SIZE } from "@/app/constants/constants";
import {
  createNode,
  dropSpecialNode,
  positionStartAndEndNodes,
} from "./helperFnList";
import NavContainer from "../NavContainer/NavContainer";
import HelpModal from "../HelpModal/HelpModal";

const Grid: React.FC = () => {
  const [state, dispatch] = useReducer(gridReducer, initialGridState);
  const [isWpressed, setIsWpressed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [nodeSize, setNodeSize] = useState(NODE_SIZE);

  const navWrapperRef = useRef<HTMLDivElement | null>(null);

  // Calculate grid dimensions based on available screen size
  const calculateAndSetGridDimensions = useCallback(
    (nodeSize: number, navWrapper: HTMLDivElement | null) => {
      const { rows, cols } = calculateGridDimensions(nodeSize, navWrapper);
      dispatch({ type: "SET_GRID_DIMENSIONS", payload: { rows, cols } });
      positionStartAndEndNodes(rows, cols, dispatch);
    },
    []
  );

  const getInitialGrid = (rows: number, cols: number) => {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push(createNode(state, col, row));
      }
      grid.push(currentRow);
    }

    return grid;
  };

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      const { startNode, finishNode, bombNode } = state;
      const { row: startRow, col: startCol } = startNode;
      const { row: finishRow, col: finishCol } = finishNode;
      const { row: bombRow, col: bombCol } = bombNode;

      if (
        (row === startRow && col === startCol) ||
        (row === finishRow && col === finishCol) ||
        (row === bombRow && col === bombCol)
      ) {
        return;
      }

      const { grid } = state;
      let newGrid = grid;

      if (isWpressed) {
        newGrid = getNewGridWithWeightToggled(
          grid,
          row,
          col,
          nodeSize,
          navWrapperRef.current
        );
      } else {
        newGrid = getNewGridWithWallToggled(grid, row, col);
      }
      dispatch({ type: "SET_GRID", payload: newGrid });
      dispatch({ type: "TOGGLE_MOUSE_PRESSED", payload: true });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isWpressed, nodeSize, state.grid]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      const { isMousePressed, grid } = state;

      if (!isMousePressed) return;

      if (isWpressed) {
        const newGrid = getNewGridWithWeightToggled(
          grid,
          row,
          col,
          nodeSize,
          navWrapperRef.current
        );
        dispatch({ type: "SET_GRID", payload: newGrid });
      } else {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        dispatch({ type: "SET_GRID", payload: newGrid });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.isMousePressed, state.grid, isWpressed, nodeSize]
  );

  const handleMouseUp = useCallback(() => {
    dispatch({ type: "TOGGLE_MOUSE_PRESSED", payload: false });
  }, []);

  const handleDropNode = useCallback(
    (row: number, col: number, nodeType: SpecialNode) =>
      dropSpecialNode(state, row, col, nodeType, dispatch),
    [state]
  );

  const handleToggleHelpModal = useCallback(() => {
    setIsHelpOpen(!isHelpOpen);
  }, [isHelpOpen]);

  // Initialize grid dimensions and nodes on mount
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const initNodeSize = getNodeSize(width, height); // Calculate node size on the client

    setNodeSize(initNodeSize);
    calculateAndSetGridDimensions(initNodeSize, navWrapperRef.current);
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
      calculateAndSetGridDimensions(newNodeSize, navWrapperRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateAndSetGridDimensions]);

  useEffect(() => {
    const handleWkeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "w") {
        setIsWpressed(true);
      }
    };

    const handleWkeyRelease = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "w") {
        setIsWpressed(false);
      }
    };

    window.addEventListener("keydown", handleWkeyPress);
    window.addEventListener("keyup", handleWkeyRelease);

    return () => {
      window.removeEventListener("keydown", handleWkeyPress);
      window.removeEventListener("keyup", handleWkeyRelease);
    };
  }, []);

  const {
    grid,
    gridDimensions,
    nodesInShortestPath,
    visitedBlueNodes,
    visitedPurpleNodes,
    isAlgoRunning,
    isMousePressed,
    bombDefused,
  } = state;

  const bombExist = doesBombExistInGrid(grid);

  return (
    <React.Fragment>
      <div id="nav-wrapper" ref={navWrapperRef}>
        <NavContainer
          navWrapperRef={navWrapperRef.current}
          nodeSize={nodeSize}
          state={state}
          dispatch={dispatch}
          getInitialGrid={getInitialGrid}
          calculateAndSetGridDimensions={calculateAndSetGridDimensions}
          toggleHelpModal={handleToggleHelpModal}
        />
      </div>
      <div
        className="grid mx-auto mt-3 md:mt-auto"
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
                  isBomb,
                  isWall,
                  isMazeWall,
                  direction,
                  weight,
                } = node;
                const isShortestPath = nodesInShortestPath.includes(node);
                const isPurpleVisited = visitedPurpleNodes.includes(node);
                const isBlueVisited = visitedBlueNodes.includes(node);

                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    bombExist={bombExist}
                    isBombDefused={bombDefused}
                    isBomb={isBomb}
                    isWall={isWall}
                    isMazeWall={isMazeWall}
                    isBlueVisited={isBlueVisited}
                    isPurpleVisited={isPurpleVisited}
                    isShortestPath={isShortestPath}
                    isAlgoRunning={isAlgoRunning}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    onDropNode={handleDropNode}
                    row={row}
                    direction={direction}
                    weight={weight}
                    nodeSize={nodeSize}
                    isMousePressed={isMousePressed}
                    isWpressed={isWpressed}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
      {isHelpOpen && <HelpModal toggleModal={handleToggleHelpModal} />}
    </React.Fragment>
  );
};

export default Grid;
