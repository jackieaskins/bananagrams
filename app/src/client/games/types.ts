import { BoardLocation } from "@/types/board";
import { Game } from "@/types/game";

export type GameState = {
  gameInfo: Game;
  handleDump: (
    tiles: Array<{
      tileId: string;
      boardLocation: BoardLocation | null;
    }>,
  ) => void;
  handleMoveTilesFromHandToBoard: (
    tiles: Array<{ tileId: string; boardLocation: BoardLocation }>,
  ) => void;
  handleMoveTilesFromBoardToHand: (boardLocations: BoardLocation[]) => void;
  handleMoveTilesOnBoard: (
    locations: Array<{
      fromLocation: BoardLocation;
      toLocation: BoardLocation;
    }>,
  ) => void;
  handlePeel: () => void;
  handleShuffleHand: () => void;
  handleSpectate: () => void;
  isInGame: boolean;
};

export type GameLocationState = Partial<GameState>;
