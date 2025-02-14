import React from "react";
import "./node.css";
import { NodeDirection, SpecialNode } from "@/app/types/types";
interface INodeProps {
  col: number;
  isFinish: boolean;
  isStart: boolean;
  bombExist: boolean;
  isBombDefused: boolean;
  isBomb: boolean;
  isWall: boolean;
  isMazeWall: boolean;
  isVisited: boolean;
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
}

const Node: React.FC<INodeProps> = ({
  col,
  isFinish,
  isStart,
  bombExist,
  isBombDefused,
  isBomb,
  isWall,
  isMazeWall,
  isVisited,
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
  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : isBomb
    ? "node-bomb"
    : isWall && isMazeWall
    ? "node-wall maze-wall"
    : isWall
    ? "node-wall"
    : isMazeWall
    ? "maze-wall"
    : isShortestPath && direction
    ? `node-shortest-path node-arrow-${direction}`
    : isShortestPath
    ? "node-shortest-path"
    : (bombExist && isVisited && !isBombDefused)
    ? "visited-while-bomb-active"
    : isVisited
    ? "node-visited"
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
        if (e.button !== 0 || isAlgoRunning) return; // Prevent interaction if the algorithm is running
        onMouseDown(row, col);
      }}
      onMouseEnter={() => {
        if (isAlgoRunning) return; // Prevent interaction if the algorithm is running
        onMouseEnter(row, col);
      }}
      onMouseUp={() => onMouseUp()}
      draggable={(isFinish || isStart || isBomb) && !isAlgoRunning} // Disable dragging if the algorithm is running
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()} // Allow drop
      onDrop={handleDrop}
    />
  );
};

export default Node;
