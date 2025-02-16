import React from "react";
import "./node.css";
import { NodeDirection, SpecialNode } from "@/app/types/types";
interface INodeProps {
  col: number;
  isFinish: boolean;
  isStart: boolean;
  bombExist: boolean;
  isBomb: boolean;
  isWall: boolean;
  isMazeWall: boolean;
  isBlueVisited: boolean;
  isPurpleVisited: boolean;
  isShortestPath: boolean;
  isAlgoRunning: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  onDropNode: (row: number, col: number, nodeType: SpecialNode) => void;
  row: number;
  direction: NodeDirection;
  nodeSize: number;
  isMousePressed: boolean;
  isBombDefused?: boolean;
}

const Node: React.FC<INodeProps> = ({
  col,
  isFinish,
  isStart,
  isBomb,
  isBombDefused,
  bombExist,
  isWall,
  isMazeWall,
  isBlueVisited,
  isPurpleVisited,
  isShortestPath,
  isAlgoRunning,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onDropNode,
  row,
  direction,
  nodeSize,
  isMousePressed,
}) => {
  const extraClassName =
    isFinish && isShortestPath && bombExist
      ? "node-robot node-shortest-path"
      : isShortestPath && direction && bombExist
      ? "node-robot"
      : isShortestPath && direction
      ? `node-shortest-path node-arrow-${direction}`
      : isFinish && isShortestPath
      ? "node-finish node-shortest-path"
      : isFinish
      ? "node-finish"
      : isStart && bombExist
      ? "node-robot"
      : isStart
      ? "node-start"
      : isBomb && isBombDefused && isShortestPath
      ? "node-bomb defused-bomb node-shortest-path"
      : isBomb
      ? "node-bomb"
      : isWall && isMazeWall
      ? "node-wall maze-wall"
      : isWall
      ? "node-wall"
      : isMazeWall
      ? "maze-wall"
      : isShortestPath
      ? "node-shortest-path"
      : isBlueVisited
      ? "node-visited"
      : isPurpleVisited
      ? "visited-while-bomb-active"
      : (isStart || isFinish) && isMousePressed
      ? "node-dragging-disabled"
      : "";

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isAlgoRunning || isMousePressed) {
      e.preventDefault();
      return;
    }

    let type = "";
    if (isStart) type = "start";
    if (isFinish) type = "finish";
    if (isBomb) type = "bomb";

    e.dataTransfer.setData("text/plain", type);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const type = e.dataTransfer.getData("text/plain") as SpecialNode;
    onDropNode(row, col, type);
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      style={{
        width: `${nodeSize}px`,
        height: `${nodeSize}px`,
      }}
      onMouseDown={(e) => {
        if (e.button !== 0 || isAlgoRunning) return;
        onMouseDown(row, col);
      }}
      onMouseEnter={() => {
        if (isAlgoRunning) return;
        onMouseEnter(row, col);
      }}
      onMouseUp={() => onMouseUp()}
      draggable={(isFinish || isStart || isBomb) && !isAlgoRunning}
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    />
  );
};

export default Node;
