import { atom } from 'recoil';

import { BoardPosition } from '../board/types';
import { Tile } from './types';

export type SelectedTileType = {
  tile: Tile;
  boardPosition: BoardPosition | null;
};

export const selectedTileState = atom<SelectedTileType | null>({
  key: 'selectedTileState',
  default: null,
});
