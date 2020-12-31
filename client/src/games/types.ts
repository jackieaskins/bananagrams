import { BoardLocation } from '../boards/types';
import { Player } from '../players/types';
import { Tile, TileItem } from '../tiles/types';

export type GameStatus = 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'ENDING';
export type GameInfo = {
  gameId: string;
  gameName: string;
  status: GameStatus;
  countdown: number;
  bunch: Tile[];
  players: Player[];
  previousSnapshot: Player[] | null;
};

export type GameState = {
  gameInfo: GameInfo;
  handleDump: (tileItem: TileItem) => void;
  handleMoveTileFromHandToBoard: (
    tileId: string,
    boardLocation: BoardLocation
  ) => void;
  handleMoveTileFromBoardToHand: (boardLocation: BoardLocation | null) => void;
  handleMoveAllTilesFromBoardToHand: () => void;
  handleMoveTileOnBoard: (
    fromLocation: BoardLocation,
    toLocation: BoardLocation
  ) => void;
  handlePeel: () => void;
  isInGame: boolean;
  walkthroughEnabled: boolean;
};

export type GameLocationState = Partial<GameState>;
