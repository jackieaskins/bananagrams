import { Tile } from "./tile";

export type BoardLocation = {
  x: number;
  y: number;
};

export enum Direction {
  ACROSS = "ACROSS",
  DOWN = "DOWN",
}

export enum ValidationStatus {
  NOT_VALIDATED = "NOT_VALIDATED",
  VALID = "VALID",
  INVALID = "INVALID",
}

export type WordInfo = {
  start: BoardLocation;
  validation: ValidationStatus;
};

export type AbstractBoardSquare<T> = {
  tile: T;
  wordInfo: Record<Direction, WordInfo>;
};

export type AbstractBoard<T> = Record<string, AbstractBoardSquare<T>>;

export type BoardSquare = AbstractBoardSquare<Tile>;

export type Board = AbstractBoard<Tile>;
