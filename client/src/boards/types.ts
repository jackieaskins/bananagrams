import { Tile } from '../tiles/types';

export type Board = (Tile | null)[][];
export type BoardPosition = {
  x: number;
  y: number;
};
