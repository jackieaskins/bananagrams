import { createContext, useContext } from "react";
import { GameState, GameInfo } from "./types";

type GameProviderProps = {
  children: React.ReactNode;
  gameState: GameState;
};

export function getEmptyGameInfo(gameId: string): GameInfo {
  return {
    gameId,
    gameName: "",
    isInProgress: false,
    bunch: [],
    players: [],
    previousSnapshot: null,
  };
}

export function getEmptyGameState(gameId: string): GameState {
  return {
    gameInfo: getEmptyGameInfo(gameId),
    handleDump: (): void => undefined,
    handleMoveTileFromHandToBoard: (): void => undefined,
    handleMoveTileFromBoardToHand: (): void => undefined,
    handleMoveAllTilesFromBoardToHand: (): void => undefined,
    handleMoveTileOnBoard: (): void => undefined,
    handlePeel: (): void => undefined,
    isInGame: false,
    walkthroughEnabled: false,
  };
}

export const GameContext = createContext<GameState>(getEmptyGameState(""));

export function GameProvider({
  children,
  gameState,
}: GameProviderProps): JSX.Element {
  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  );
}

export function useGame(): GameState {
  return useContext(GameContext);
}
