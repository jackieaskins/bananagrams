import React, { createContext, useContext } from 'react';
import { GameState, GameInfo } from './types';

type GameProviderProps = {
  gameState: GameState;
};

export const getEmptyGameInfo = (gameId: string): GameInfo => ({
  gameId,
  gameName: '',
  isInProgress: false,
  bunch: [],
  players: [],
  previousSnapshot: null,
});

export const getEmptyGameState = (gameId: string): GameState => ({
  gameInfo: getEmptyGameInfo(gameId),
  handleDump: (): void => undefined,
  handleMoveTileFromHandToBoard: (): void => undefined,
  handleMoveTileFromBoardToHand: (): void => undefined,
  handleMoveAllTilesFromBoardToHand: (): void => undefined,
  handleMoveTileOnBoard: (): void => undefined,
  handlePeel: (): void => undefined,
  isInGame: false,
  walkthroughEnabled: false,
});

export const GameContext = createContext<GameState>(getEmptyGameState(''));

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  gameState,
}) => <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;

export const useGame = (): GameState => useContext(GameContext);
