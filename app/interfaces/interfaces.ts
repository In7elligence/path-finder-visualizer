export interface ISimpleNode {
    row: number;
    col: number;
}

export interface INode extends ISimpleNode {
    isStart: boolean;
    isFinish: boolean;
    distance: number;
    isVisited: boolean;
    isWall: boolean;
    previousNode: INode | null; // Allow null
  }