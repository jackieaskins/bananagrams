import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil';

import { Player } from '../players/types';
import { getUserId } from '../socket';

export type GameState = {
  inProgressState: RecoilState<boolean>;
  nameState: RecoilState<string>;
  playersState: RecoilState<Player[]>;
  currentPlayerState: RecoilValueReadOnly<Player | null>;
};

export const initializeState = (): GameState => {
  const inProgressState = atom({
    key: 'gameInProgress',
    default: false,
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
    inProgressState,
    nameState,
    playersState,
    currentPlayerState,
  };
};
