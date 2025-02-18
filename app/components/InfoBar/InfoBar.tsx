"use client";

import React  from "react";
import "@/app/styles/specialNodes.css";
import { algoInfoMap } from "./utils/utils";
import { AvailableAlgorithms } from "@/app/types/types";

interface IInfoBarProps {
  nodeSize: number;
  bombExist: boolean;
  weightExist: boolean;
  selectedAlgorithm: AvailableAlgorithms;
}

const InfoBar: React.FC<IInfoBarProps> = ({
  nodeSize,
  bombExist,
  weightExist,
  selectedAlgorithm,
}) => {
  const algoInfo = algoInfoMap[selectedAlgorithm];
  const isWeightedAlgo = !algoInfo.weight.includes("unweighted");

  return (
    <div className="relative hidden w-full md:block text-black 4k:text-4xl py-5">
      <div className="container flex justify-center mx-auto gap-8 4k:gap-24">
        <div className="flex items-center">
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className={`node-${
              bombExist ? "robot" : "start"
            } inline-block mr-2`}
          ></div>
          <span>Start Node</span>
        </div>
        <div className="flex items-center">
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className="node-finish inline-block mr-2"
          ></div>
          <span>Target Node</span>
        </div>
        <div className="flex items-center">
          <div
            style={{
              width: `${nodeSize + 10}px`,
              height: `${nodeSize + 10}px`,
            }}
            className="node-bomb inline-block mr-2"
          ></div>
          <span>Bomb Node</span>
        </div>
        <div className="flex items-center">
          <div
            style={{
              width: `${nodeSize}px`,
              height: `${nodeSize}px`,
            }}
            className="node-weight-no-animation inline-block mr-2"
          ></div>
          <span className={`${(weightExist && !isWeightedAlgo) ? "crossed-line" : ""}`}>Weight Node</span>
        </div>
        <div className="flex items-center">
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className="node inline-block mr-2"
          ></div>
          <span>Unvisited Node</span>
        </div>
        <div className="flex items-center">
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className="node-visited-no-animation inline-block mr-2"
          ></div>
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className="visited-while-bomb-active-no-animation inline-block mr-2"
          ></div>
          <span>Visited Nodes</span>
        </div>
        <div className="flex items-center">
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className="node-shortest-path-no-animation inline-block mr-2"
          ></div>
          <span>Shortest Path Node</span>
        </div>
        <div className="flex items-center">
          <div
            style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
            className="node-wall-no-animation inline-block mr-2"
          ></div>
          <span>Wall Node</span>
        </div>
      </div>
      <div className="container flex justify-center mx-auto 4k:mt-6">
        <div className="flex items-center my-8">
          <div className="text-lg 4k:text-5xl">
            {algoInfo.info}{" "}
            <b>
              <i>{algoInfo.weight}</i>
            </b>{" "}
            {algoInfo.connect}{" "}
            <b>
              <i>{algoInfo.guarantee}</i>
            </b>{" "}
            {algoInfo.closing}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBar;
