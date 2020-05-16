import { Tile } from '../tiles/types';

export enum Direction {
  ACROSS = 'ACROSS',
  DOWN = 'DOWN',
}
export type BoardLocation = {
  x: number;
  y: number;
};
export type WordInfo = {
  start: BoardLocation;
  valid: boolean;
};
export type BoardSquare = {
  tile: Tile;
  wordInfo: {
    [Direction.ACROSS]?: WordInfo;
    [Direction.DOWN]?: WordInfo;
  };
};
export type Board = (BoardSquare | null)[][];
