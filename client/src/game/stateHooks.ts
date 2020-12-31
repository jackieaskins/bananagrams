import { useRecoilCallback, useRecoilValue } from 'recoil';

import { initializeState } from '../game/state';
import { GameInfo } from '../games/types';
import { Player } from '../players/types';

const {
  inProgressState,
  nameState,
  playersState,
  currentPlayerState,
} = initializeState();

export const useIsGameInProgress = (): boolean =>
  useRecoilValue(inProgressState);

export const useGameName = (): string => useRecoilValue(nameState);

export const useGamePlayers = (): Player[] => useRecoilValue(playersState);

export const useCurrentPlayer = (): Player | null =>
  useRecoilValue(currentPlayerState);

export const useUpdateGameState = (): ((gameInfo: GameInfo) => void) =>
  useRecoilCallback(
    ({ set }) => (gameInfo) => {
      set(inProgressState, gameInfo.isInProgress);
      set(nameState, gameInfo.gameName);
      set(playersState, gameInfo.players);
    },
    []
  );
