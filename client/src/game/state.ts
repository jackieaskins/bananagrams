import { atom, useRecoilCallback, useRecoilValue } from 'recoil';

import { GameInfo } from '../games/types';

const gameInProgressState = atom({
  key: 'gameInProgress',
  default: false,
});
export const useIsGameInProgress = (): boolean =>
  useRecoilValue(gameInProgressState);

type UpdateGameState = (gameInfo: GameInfo) => void;
export const useUpdateGameState = (): UpdateGameState =>
  useRecoilCallback(
    ({ set }) => (gameInfo) => {
      set(gameInProgressState, gameInfo.isInProgress);
    },
    []
  );
