import { BoardLocation } from "../../types/board";
import { Game } from "../../types/game";
import { TileItem } from "../tiles/types";

export type GameState = {
  gameInfo: Game;
  handleDump: (tileItem: TileItem) => void;
  handleMoveTileFromHandToBoard: (
    tileId: string,
    boardLocation: BoardLocation,
  ) => void;
  handleMoveTileFromBoardToHand: (boardLocation: BoardLocation | null) => void;
  handleMoveTileOnBoard: (
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ) => void;
  handlePeel: () => void;
  isInGame: boolean;
};

export type GameLocationState = Partial<GameState>;
