import { Player } from '../players/types';
import { Tile, TileItem } from '../tiles/types';
import { BoardLocation } from '../boards/types';

export type GameInfo = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  bunch: Tile[];
  players: Player[];
  previousSnapshot: Player[] | null;
};

export type GameState = {
  gameInfo: GameInfo;
  handleDump: (tileItem: TileItem) => void;
  handleMoveTileFromBoardToHand: (boardLocation: BoardLocation | null) => void;
  handleMoveTileFromHandToBoard: (
    tileId: string,
    boardLocation: BoardLocation
  ) => void;
  handleMoveTileOnBoard: (
    fromLocation: BoardLocation,
    toLocation: BoardLocation
  ) => void;
  handlePeel: () => void;
  isInGame: boolean;
  walkthroughEnabled: boolean;
};

export type GameLocationState = Partial<GameState>;
