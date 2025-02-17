import { IAlgoInfoMap } from "@/app/interfaces/interfaces";

export const algoInfoMap: IAlgoInfoMap = {
  dijkstras: {
    info: "Dijkstra's Algorithm is",
    weight: "weighted",
    connect: "and",
    guarantee: "guarantees",
    closing: "the shortest path!",
  },
  astar: {
    info: "A* Search is",
    weight: "weighted",
    connect: "and",
    guarantee: "guarantees",
    closing: "the shortest path!",
  },
  greedyBFS: {
    info: "Greedy Best-First Search is",
    weight: "weighted",
    connect: "and",
    guarantee: "does not guarantee",
    closing: "the shortest path!",
  },
  bfs: {
    info: "Breadth-First Search is",
    weight: "unweighted",
    connect: "and",
    guarantee: "guarantees",
    closing: "the shortest path!",
  },
  dfs: {
    info: "Depth-First Search is",
    weight: "unweighted",
    connect: "and",
    guarantee: "does not guarantee",
    closing: "the shortest path!",
  },
};
