import {
  atom,
  atomFamily,
  RecoilState,
  RecoilValueReadOnly,
  selector,
} from 'recoil';

import { Board, BoardSquare } from '../boards/types';
import { GameStatus } from '../games/types';
import { Hand } from '../hands/types';
import { Player } from '../players/types';
import { getUserId } from '../socket';
import { Tile } from '../tiles/types';

export type GameState = {
  statusState: RecoilState<GameStatus>;
  countdownState: RecoilState<number>;
  nameState: RecoilState<string>;
  bunchState: RecoilState<Tile[]>;
  bunchCountState: RecoilValueReadOnly<number>;
  playersState: RecoilState<Player[]>;
  currentPlayerState: RecoilValueReadOnly<Player | null>;
  handsState: RecoilState<Record<string, Hand>>;
  currentHandState: RecoilState<Hand>;
  boardsState: RecoilState<Record<string, Board>>;
  currentBoardState: RecoilState<Board>;
  currentBoardSquaresState: (param: string) => RecoilState<BoardSquare | null>;
};

export const initializeState = (): GameState => {
  const statusState = atom<GameStatus>({
    key: 'gameStatus',
    default: 'NOT_STARTED',
  });

  const countdownState = atom({
    key: 'gameCountdown',
    default: 0,
  });

  const nameState = atom({
    key: 'gameName',
    default: '',
  });

  const bunchState = atom<Tile[]>({
    key: 'gameBunch',
    default: [],
  });
  const bunchCountState = selector({
    key: 'bunchCount',
    get: ({ get }) => get(bunchState).length,
  });

  const playersState = atom<Player[]>({
    key: 'gamePlayers',
    default: [],
  });
  const currentPlayerState = selector({
    key: 'gameCurrentPlayer',
    get: ({ get }) =>
      get(playersState).find(({ userId }) => userId === getUserId()) ?? null,
  });

  const handsState = atom<Record<string, Hand>>({
    key: 'gameHands',
    default: {},
  });

  const currentHandState = atom<Hand>({
    key: 'gameCurrentHand',
    default: [],
  });

  const boardsState = atom<Record<string, Board>>({
    key: 'gameBoards',
    default: {},
  });

  const currentBoardState = atom<Board>({
    key: 'gameCurrentBoard',
    default: {},
  });
  const currentBoardSquaresState = atomFamily<BoardSquare | null, string>({
    key: 'gameCurrentBoardSquares',
    default: null,
  });

  return {
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
  };
};
