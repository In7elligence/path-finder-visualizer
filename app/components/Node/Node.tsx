import React from "react";
import "./node.css";
import { NodeDirection } from "@/app/types/types";

interface INodeProps {
  col: number;
  isFinish: boolean;
  isStart: boolean;
  isWall: boolean;
  isMazeWall: boolean;
  isVisited: boolean;
  isShortestPath: boolean;
  isAlgoRunning: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  onDropNode: (row: number, col: number, isStart: boolean) => void;
  row: number;
  direction: NodeDirection;
  nodeSize: number;
}

const Node: React.FC<INodeProps> = ({
  col,
  isFinish,
  isStart,
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
  nodeSize, // Destructure nodeSize
}) => {
  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
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
    : isVisited
    ? "node-visited"
    : "";

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isAlgoRunning) {
      e.preventDefault(); // Prevent dragging if the algorithm is running
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify({ isStart }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isAlgoRunning) {
      e.preventDefault(); // Prevent dropping if the algorithm is running
      return;
    }

    const data = e.dataTransfer.getData("text/plain");
    const { isStart: isDraggingStart } = JSON.parse(data);

    onDropNode(row, col, isDraggingStart);
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
      draggable={(isFinish || isStart) && !isAlgoRunning} // Disable dragging if the algorithm is running
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()} // Allow drop
      onDrop={handleDrop}
    />
  );
};

export default Node;