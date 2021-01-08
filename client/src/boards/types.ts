import { Tile } from '../tiles/types';

export enum Direction {
  ACROSS = 'ACROSS',
  DOWN = 'DOWN',
}
export type BoardPosition = {
  row: number;
  col: number;
};
export enum ValidationStatus {
  NOT_VALIDATED = 'NOT_VALIDATED',
  VALID = 'VALID',
  INVALID = 'INVALID',
}
export type WordInfo = {
  start: BoardPosition;
  validationStatus: ValidationStatus;
};
export type BoardSquare = {
  tile: Tile;
  validationStatus: ValidationStatus;
};
export type Board = Record<string, BoardSquare | null>;

export const getSquareId = ({ row, col }: BoardPosition): string =>
  `${row},${col}`;
