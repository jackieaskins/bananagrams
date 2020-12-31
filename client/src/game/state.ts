import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil';

import { GameStatus } from '../games/types';
import { Player } from '../players/types';
import { getUserId } from '../socket';

export type GameState = {
  statusState: RecoilState<GameStatus>;
  countdownState: RecoilState<number>;
  nameState: RecoilState<string>;
  playersState: RecoilState<Player[]>;
  currentPlayerState: RecoilValueReadOnly<Player | null>;
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

  return {
    statusState,
    countdownState,
    nameState,
    playersState,
    currentPlayerState,
  };
};
