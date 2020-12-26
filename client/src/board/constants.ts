import { TILE_SIZE } from '../tile/constants';

const SCREEN_MULTIPLIER = 1.5;
const MIN_TILES = 25;

const getNumTiles = (len: number): number =>
  Math.max(Math.ceil((len * SCREEN_MULTIPLIER) / TILE_SIZE), MIN_TILES);
export const TILES_PER_ROW = getNumTiles(window.screen.width);
export const TILES_PER_COL = getNumTiles(window.screen.height);

export const BOARD_WIDTH = TILES_PER_ROW * TILE_SIZE + 2;
export const BOARD_HEIGHT = TILES_PER_COL * TILE_SIZE + 2;

export const BORDER_STYLE = '1px solid rgba(173, 216, 230, 0.5)';
