import { useRecoilCallback, useRecoilValue } from 'recoil';

import { playerFixture } from '../fixtures/player';
import {
  useGameStatus,
  useGameCountdown,
  useGameName,
  useGamePlayers,
  useCurrentPlayer,
  useUpdateGameState,
} from './stateHooks';

const mockSet = jest.fn();
const mockUseRecoilCallback = useRecoilCallback as jest.Mock;
const mockUseRecoilValue = useRecoilValue as jest.Mock;
const mockReturnValue = 'mockReturnValue';
jest.mock('recoil', () => ({
  useRecoilCallback: jest.fn((fn) => fn({ set: mockSet })),
  useRecoilValue: jest.fn().mockReturnValue('mockReturnValue'),
}));

jest.mock('./state', () => ({
  initializeState: jest.fn().mockReturnValue({
    statusState: 'statusState',
    countdownState: 'countdownState',
    nameState: 'nameState',
    playersState: 'playersState',
    currentPlayerState: 'currentPlayerState',
  }),
}));

describe('state hooks', () => {
  test('useGameStatus returns recoil value', () => {
    expect(useGameStatus()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('statusState');
  });

  test('useGameCountdown returns recoil value', () => {
    expect(useGameCountdown()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('countdownState');
  });

  test('useGameName returns recoil value', () => {
    expect(useGameName()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('nameState');
  });

  test('useGamePlayers returns recoil value', () => {
    expect(useGamePlayers()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('playersState');
  });

  test('useCurrentPlayer returns recoil value', () => {
    expect(useCurrentPlayer()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('currentPlayerState');
  });

  test('useUpdateGameState updates game state through recoil callback', () => {
    const gameInfo = {
      gameName: 'gameName',
      status: 'IN_PROGRESS',
      countdown: 3,
      players: [playerFixture()],
    };

    useUpdateGameState();

    mockUseRecoilCallback.mock.results[0].value(gameInfo);

    expect(mockUseRecoilCallback).toHaveBeenCalledWith(
      expect.any(Function),
      []
    );
    expect(mockSet).toHaveBeenCalledWith('statusState', gameInfo.status);
    expect(mockSet).toHaveBeenCalledWith('countdownState', gameInfo.countdown);
    expect(mockSet).toHaveBeenCalledWith('nameState', gameInfo.gameName);
    expect(mockSet).toHaveBeenCalledWith('playersState', gameInfo.players);
  });
});
