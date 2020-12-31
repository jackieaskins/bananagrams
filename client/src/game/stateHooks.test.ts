import { useRecoilCallback, useRecoilValue } from 'recoil';

import { playerFixture } from '../fixtures/player';
import {
  useIsGameInProgress,
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
    inProgressState: 'inProgressState',
    nameState: 'nameState',
    playersState: 'playersState',
    currentPlayerState: 'currentPlayerState',
  }),
}));

describe('state hooks', () => {
  test('useIsGameInProgress returns recoil value', () => {
    expect(useIsGameInProgress()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('inProgressState');
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
      isInProgress: false,
      players: [playerFixture()],
    };

    useUpdateGameState();

    mockUseRecoilCallback.mock.results[0].value(gameInfo);

    expect(mockUseRecoilCallback).toHaveBeenCalledWith(
      expect.any(Function),
      []
    );
    expect(mockSet).toHaveBeenCalledWith(
      'inProgressState',
      gameInfo.isInProgress
    );
    expect(mockSet).toHaveBeenCalledWith('nameState', gameInfo.gameName);
    expect(mockSet).toHaveBeenCalledWith('playersState', gameInfo.players);
  });
});
