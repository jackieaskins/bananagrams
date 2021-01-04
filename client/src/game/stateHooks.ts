import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  Board,
  BoardPosition,
  BoardSquare,
  getSquareId,
} from '../boards/types';
import { initializeState } from '../game/state';
import { GameInfo, GameStatus } from '../games/types';
import { Hand } from '../hands/types';
import { Player } from '../players/types';
import { SetState } from '../state/types';

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

export const useCurrentHand = (): Hand => useRecoilValue(currentHandState);
export const useSetCurrentHand = (): SetState<Hand> =>
  useSetRecoilState(currentHandState);

export const useGameBoards = (): Record<string, Board> =>
  useRecoilValue(boardsState);

export const useCurrentBoardSquare = (
  position: BoardPosition
): BoardSquare | null =>
  useRecoilValue(currentBoardState(getSquareId(position)));
export const useSetCurrentBoardSquare = (): ((boardSquare: {
  id: string;
  square: BoardSquare | null;
}) => void) =>
  useRecoilCallback(
    ({ set }) => ({ id, square }) => {
      set(currentBoardState(id), square);
    },
    []
  );

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
