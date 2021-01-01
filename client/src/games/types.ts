import { Board, BoardPosition } from '../boards/types';
import { Hand } from '../hands/types';
import { Player } from '../players/types';
import { Tile, TileItem } from '../tiles/types';

export type GameStatus = 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'ENDING';
export type Snapshot = {
  players: Player[];
  hands: Record<string, Hand>;
  boards: Record<string, Board>;
};
export type GameInfo = {
  gameId: string;
  gameName: string;
  status: GameStatus;
  countdown: number;
  bunch: Tile[];
  players: Player[];
  hands: Record<string, Hand>;
  boards: Record<string, Board>;
  previousSnapshot: Snapshot | null;
};

export type GameState = {
  gameInfo: GameInfo;
  handleDump: (tileItem: TileItem) => void;
  handleMoveTileFromHandToBoard: (
    tileId: string,
    boardPosition: BoardPosition
  ) => void;
  handleMoveTileFromBoardToHand: (boardPosition: BoardPosition | null) => void;
  handleMoveAllTilesFromBoardToHand: () => void;
  handleMoveTileOnBoard: (
    fromPosition: BoardPosition,
    toPosition: BoardPosition
  ) => void;
  handlePeel: () => void;
  isInGame: boolean;
  walkthroughEnabled: boolean;
};

export type GameLocationState = Partial<GameState>;
