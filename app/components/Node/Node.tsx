import React from "react";
import "@/app/styles/specialNodes.css";
import "./node.css";
import { NodeDirection, SpecialNode } from "@/app/types/types";
import { getNodeClasses } from "./helperFnList";
export interface INodeProps {
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
  weight: number;
  isMousePressed: boolean;
  isWpressed: boolean;
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
  weight,
  isMousePressed,
  isWpressed
}) => {
  const extraClassName = getNodeClasses({
    isFinish,
    isShortestPath,
    bombExist,
    direction,
    weight,
    isStart,
    isBomb,
    isBombDefused,
    isWall,
    isMazeWall,
    isBlueVisited,
    isPurpleVisited,
    isMousePressed,
    isWpressed
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isAlgoRunning || isMousePressed || isWpressed) {
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

export default React.memo(Node);
