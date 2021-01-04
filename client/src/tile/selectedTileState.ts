import { atom } from 'recoil';

import { BoardPosition } from '../boards/types';
import { Tile } from '../tiles/types';

export type SelectedTileType = {
  tile: Tile;
  boardPosition: BoardPosition | null;
};

export const selectedTileState = atom<SelectedTileType | null>({
  key: 'selectedTileState',
  default: null,
});
