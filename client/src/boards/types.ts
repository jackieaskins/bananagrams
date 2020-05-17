import { Tile } from '../tiles/types';

export enum Direction {
  ACROSS = 'ACROSS',
  DOWN = 'DOWN',
}
export type BoardLocation = {
  x: number;
  y: number;
};
export enum ValidationStatus {
  NOT_VALIDATED = 'NOT_VALIDATED',
  VALID = 'VALID',
  INVALID = 'INVALID',
}
export type WordInfo = {
  start: BoardLocation;
  validation: ValidationStatus;
};
export type BoardSquare = {
  tile: Tile;
  wordInfo: Record<Direction, WordInfo>;
};
export type Board = (BoardSquare | null)[][];
