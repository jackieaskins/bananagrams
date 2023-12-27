import { BoardLocation } from "../../types/board";
import { Game } from "../../types/game";

export type GameState = {
  gameInfo: Game;
  handleDump: (tile: {
    id: string;
    boardLocation: BoardLocation | null;
  }) => void;
  handleMoveTileFromHandToBoard: (
    tileId: string,
    boardLocation: BoardLocation,
  ) => void;
  handleMoveTileFromBoardToHand: (boardLocation: BoardLocation) => void;
  handleMoveTileOnBoard: (
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ) => void;
  handlePeel: () => void;
  isInGame: boolean;
};

export type GameLocationState = Partial<GameState>;
