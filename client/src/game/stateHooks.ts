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
import { Tile } from '../tiles/types';

const {
  statusState,
  countdownState,
  nameState,
  bunchState,
  bunchCountState,
  playersState,
  currentPlayerState,
  handsState,
  currentHandState,
  boardsState,
  currentBoardState,
  currentBoardSquaresState,
} = initializeState();

export const useGameStatus = (): GameStatus => useRecoilValue(statusState);

export const useGameCountdown = (): number => useRecoilValue(countdownState);

export const useGameName = (): string => useRecoilValue(nameState);

export const useGameBunch = (): Tile[] => useRecoilValue(bunchState);
export const useGameBunchCount = (): number => useRecoilValue(bunchCountState);

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
export const useCurrentBoard = (): Board => useRecoilValue(currentBoardState);
export const useCurrentBoardSquare = (
  position: BoardPosition
): BoardSquare | null =>
  useRecoilValue(currentBoardSquaresState(getSquareId(position)));

export const useResetCurrentBoard = (): (() => void) =>
  useRecoilCallback(({ reset, snapshot }) => async () => {
    const oldBoard = await snapshot.getPromise(currentBoardState);

    reset(currentBoardState);
    Object.keys(oldBoard).forEach((id) => {
      reset(currentBoardSquaresState(id));
    });
  });

export const useSetCurrentBoard = (): ((board: Board) => void) =>
  useRecoilCallback(
    ({ set }) => (board) => {
      set(currentBoardState, board);
      Object.entries(board).forEach(([id, square]) => {
        set(currentBoardSquaresState(id), (currSquare) => {
          if (
            currSquare &&
            square &&
            currSquare.tile.id === square.tile.id &&
            currSquare.tile.letter === square.tile.letter &&
            currSquare.validationStatus === square.validationStatus
          ) {
            return currSquare;
          }

          return square;
        });
      });
    },
    []
  );

export const useResetGameState = (): (() => void) =>
  useRecoilCallback(
    ({ reset }) => () => {
      reset(statusState);
      reset(countdownState);
      reset(nameState);
      reset(bunchState);
      reset(playersState);
      reset(handsState);
      reset(boardsState);
    },
    []
  );

export const useUpdateGameState = (): ((gameInfo: GameInfo) => void) =>
  useRecoilCallback(
    ({ set }) => (gameInfo) => {
      set(statusState, gameInfo.status);
      set(countdownState, gameInfo.countdown);
      set(nameState, gameInfo.gameName);
      set(bunchState, gameInfo.bunch);
      set(playersState, gameInfo.players);
      set(handsState, gameInfo.hands);
      set(boardsState, gameInfo.boards);
    },
    []
  );
