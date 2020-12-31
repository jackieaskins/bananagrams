import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil';

import { Board } from '../boards/types';
import { GameStatus } from '../games/types';
import { Hand } from '../hands/types';
import { Player } from '../players/types';
import { getUserId } from '../socket';

export type GameState = {
  statusState: RecoilState<GameStatus>;
  countdownState: RecoilState<number>;
  nameState: RecoilState<string>;
  playersState: RecoilState<Player[]>;
  currentPlayerState: RecoilValueReadOnly<Player | null>;
  handsState: RecoilState<Record<string, Hand>>;
  currentHandState: RecoilValueReadOnly<Hand | null>;
  boardsState: RecoilState<Record<string, Board>>;
  currentBoardState: RecoilValueReadOnly<Board | null>;
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

  const playersState = atom<Player[]>({
    key: 'gamePlayers',
    default: [],
  });
  const currentPlayerState = selector({
    key: 'gameCurrentPlayerState',
    get: ({ get }) =>
      get(playersState).find(({ userId }) => userId === getUserId()) ?? null,
  });

  const handsState = atom<Record<string, Hand>>({
    key: 'gameHands',
    default: {},
  });
  const currentHandState = selector({
    key: 'gameCurrentHandState',
    get: ({ get }) => get(handsState)[getUserId()] ?? null,
  });

  const boardsState = atom<Record<string, Board>>({
    key: 'gameBoards',
    default: {},
  });
  const currentBoardState = selector({
    key: 'gameCurrentBoardState',
    get: ({ get }) => get(boardsState)[getUserId()] ?? null,
  });

  return {
    statusState,
    countdownState,
    nameState,
    playersState,
    currentPlayerState,
    handsState,
    currentHandState,
    boardsState,
    currentBoardState,
  };
};
