/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IState {
    height: number | null;
    width: number | null;
    start: number | null;
    target: number | null;
    object: { [key: string]: any } | null;
    nodes: { [key: string]: any };
    nodesToAnimate: { [key: string]: any }[];
    shortestPathNodesToAnimate: { [key: string]: any }[];
    objectShortestPathNodesToAnimate: { [key: string]: any }[];
    wallsToAnimate: { [key: string]: any }[];
    isMouseDown: boolean;
    pressedNodeStatus: string | null;
    previouslyPressedNodeStatus: string | null;
    previouslySwitchedNode: string | null;
    previouslySwitchedNodeWeight: number | null;
    keyDown: boolean;
    algoDone: boolean;
    currentAlgorithm: string | null;
    currentHeuristic: string | null;
    numberOfObjects: number | null;
    isObject: boolean;
    buttonsOn: boolean;
    speed: string;
}

export const initState: IState = {
    height: null,
    width: null,
    start: null,
    target: null,
    object: null,
    nodes: {},
    nodesToAnimate: [],
    shortestPathNodesToAnimate: [],
    objectShortestPathNodesToAnimate: [],
    wallsToAnimate: [],
    isMouseDown: false,
    pressedNodeStatus: null,
    previouslyPressedNodeStatus: null,
    previouslySwitchedNode: null,
    previouslySwitchedNodeWeight: null,
    keyDown: false,
    algoDone: false,
    currentAlgorithm: null,
    currentHeuristic: null,
    numberOfObjects: null,
    isObject: false,
    buttonsOn: false,
    speed: "fast"
}