import { useRecoilCallback, useRecoilValue } from 'recoil';

import { initializeState } from '../game/state';
import { GameInfo, GameStatus } from '../games/types';
import { Player } from '../players/types';

const {
  statusState,
  countdownState,
  nameState,
  playersState,
  currentPlayerState,
} = initializeState();

export const useGameStatus = (): GameStatus => useRecoilValue(statusState);

export const useGameCountdown = (): number => useRecoilValue(countdownState);

export const useGameName = (): string => useRecoilValue(nameState);

export const useGamePlayers = (): Player[] => useRecoilValue(playersState);

export const useCurrentPlayer = (): Player | null =>
  useRecoilValue(currentPlayerState);

export const useUpdateGameState = (): ((gameInfo: GameInfo) => void) =>
  useRecoilCallback(
    ({ set }) => (gameInfo) => {
      set(statusState, gameInfo.status);
      set(countdownState, gameInfo.countdown);
      set(nameState, gameInfo.gameName);
      set(playersState, gameInfo.players);
    },
    []
  );
