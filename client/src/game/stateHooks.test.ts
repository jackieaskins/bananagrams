import { useRecoilCallback, useRecoilValue } from 'recoil';

import { playerFixture } from '../fixtures/player';
import {
  useGameStatus,
  useGameCountdown,
  useGameName,
  useGamePlayers,
  useCurrentPlayer,
  useGameHands,
  useCurrentHand,
  useGameBoards,
  useCurrentBoard,
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
    handsState: 'handsState',
    currentHandState: 'currentHandState',
    boardsState: 'boardsState',
    currentBoardState: 'currentBoardState',
  }),
}));

describe('state hooks', () => {
  it('useGameStatus returns recoil value', () => {
    expect(useGameStatus()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('statusState');
  });

  it('useGameCountdown returns recoil value', () => {
    expect(useGameCountdown()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('countdownState');
  });

  it('useGameName returns recoil value', () => {
    expect(useGameName()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('nameState');
  });

  it('useGamePlayers returns recoil value', () => {
    expect(useGamePlayers()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('playersState');
  });

  it('useCurrentPlayer returns recoil value', () => {
    expect(useCurrentPlayer()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('currentPlayerState');
  });

  it('useGameHands returns recoil value', () => {
    expect(useGameHands()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('handsState');
  });

  it('useCurrentHand returns recoil value', () => {
    expect(useCurrentHand()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('currentHandState');
  });

  it('useGameBoards returns recoil value', () => {
    expect(useGameBoards()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('boardsState');
  });

  it('useCurrentBoard returns recoil value', () => {
    expect(useCurrentBoard()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('currentBoardState');
  });

  it('useUpdateGameState updates game state through recoil callback', () => {
    const userId = 'userId';
    const gameInfo = {
      gameName: 'gameName',
      status: 'IN_PROGRESS',
      countdown: 3,
      players: [playerFixture({ userId })],
      boards: { [userId]: [[null]] },
      hands: { [userId]: [] },
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
    expect(mockSet).toHaveBeenCalledWith('handsState', gameInfo.hands);
    expect(mockSet).toHaveBeenCalledWith('boardsState', gameInfo.boards);
  });
});
