import { useRecoilCallback, useRecoilValue } from 'recoil';

import { Board } from '../boards/types';
import { initializeState } from '../game/state';
import { GameInfo, GameStatus } from '../games/types';
import { Hand } from '../hands/types';
import { Player } from '../players/types';

const {
  statusState,
  countdownState,
  nameState,
  playersState,
  currentPlayerState,
  handsState,
  currentHandState,
  boardsState,
  currentBoardState,
} = initializeState();

export const useGameStatus = (): GameStatus => useRecoilValue(statusState);

export const useGameCountdown = (): number => useRecoilValue(countdownState);

export const useGameName = (): string => useRecoilValue(nameState);

export const useGamePlayers = (): Player[] => useRecoilValue(playersState);
export const useCurrentPlayer = (): Player | null =>
  useRecoilValue(currentPlayerState);

export const useGameHands = (): Record<string, Hand> =>
  useRecoilValue(handsState);
export const useCurrentHand = (): Hand | null =>
  useRecoilValue(currentHandState);

export const useGameBoards = (): Record<string, Board> =>
  useRecoilValue(boardsState);
export const useCurrentBoard = (): Board | null =>
  useRecoilValue(currentBoardState);

export const useUpdateGameState = (): ((gameInfo: GameInfo) => void) =>
  useRecoilCallback(
    ({ set }) => (gameInfo) => {
      set(statusState, gameInfo.status);
      set(countdownState, gameInfo.countdown);
      set(nameState, gameInfo.gameName);
      set(playersState, gameInfo.players);
      set(handsState, gameInfo.hands);
      set(boardsState, gameInfo.boards);
    },
    []
  );
