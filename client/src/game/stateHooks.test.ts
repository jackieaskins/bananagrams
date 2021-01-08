import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';

import { playerFixture } from '../fixtures/player';
import {
  useGameStatus,
  useGameCountdown,
  useGameName,
  useGamePlayers,
  useCurrentPlayer,
  useGameHands,
  useCurrentHand,
  useSetCurrentHand,
  useGameBoards,
  useCurrentBoardSquare,
  useSetCurrentBoard,
  useUpdateGameState,
  useGameBunch,
  useCurrentBoard,
} from './stateHooks';

const mockSet = jest.fn();
const mockUseRecoilCallback = useRecoilCallback as jest.Mock;
const mockUseRecoilValue = useRecoilValue as jest.Mock;
const mockUseSetRecoilState = useSetRecoilState as jest.Mock;
const mockReturnValue = 'mockReturnValue';
const mockSetReturnValue = 'mockSetReturnValue';
jest.mock('recoil', () => ({
  useRecoilCallback: jest.fn((fn) => fn({ set: mockSet })),
  useRecoilValue: jest.fn().mockReturnValue('mockReturnValue'),
  useSetRecoilState: jest.fn().mockReturnValue(() => mockSetReturnValue),
}));

jest.mock('./state', () => ({
  initializeState: jest.fn().mockReturnValue({
    statusState: 'statusState',
    countdownState: 'countdownState',
    nameState: 'nameState',
    bunchState: 'bunchState',
    playersState: 'playersState',
    currentPlayerState: 'currentPlayerState',
    handsState: 'handsState',
    currentHandState: 'currentHandState',
    boardsState: 'boardsState',
    currentBoardState: 'currentBoardState',
    currentBoardSquaresState: jest
      .fn()
      .mockReturnValue('currentBoardSquaresState'),
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

  it('useGameBunch returns recoil value', () => {
    expect(useGameBunch()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('bunchState');
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

  it('useSetCurrentHand returns set recoil state', () => {
    expect(useSetCurrentHand()([])).toEqual(mockSetReturnValue);
    expect(mockUseSetRecoilState).toHaveBeenCalledWith('currentHandState');
  });

  it('useGameBoards returns recoil value', () => {
    expect(useGameBoards()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('boardsState');
  });

  it('useCurrentBoard returns recoil value', () => {
    expect(useCurrentBoard()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('currentBoardState');
  });

  it('useCurrentBoardSquare returns recoil value', () => {
    expect(useCurrentBoardSquare({ row: 0, col: 0 })).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('currentBoardSquaresState');
  });

  describe('useSetCurrentBoard', () => {
    const boardSquare = {
      tile: { id: 'A1', letter: 'A' },
      validationStatus: 'NOT_VALIDATED',
    };
    const board = {
      '0,0': boardSquare,
    };

    beforeEach(() => {
      useSetCurrentBoard();

      mockUseRecoilCallback.mock.results[0].value(board);
    });

    it('returns recoil callback', () => {
      expect(mockUseRecoilCallback).toHaveBeenCalledWith(
        expect.any(Function),
        []
      );
    });

    it('sets currentBoardState', () => {
      expect(mockSet).toHaveBeenCalledWith('currentBoardState', board);
    });

    it.each([
      [null, boardSquare],
      [boardSquare, boardSquare],
    ])('#%#: sets currentBoardSquaresState', (square, expectedSquare) => {
      expect(mockSet.mock.calls[1][1](square)).toEqual(expectedSquare);
    });
  });

  it('useUpdateGameState updates game state through recoil callback', () => {
    const userId = 'userId';
    const gameInfo = {
      gameName: 'gameName',
      status: 'IN_PROGRESS',
      bunch: [],
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

    expect(mockSet).toHaveBeenCalledTimes(7);

    expect(mockSet).toHaveBeenCalledWith('statusState', gameInfo.status);
    expect(mockSet).toHaveBeenCalledWith('countdownState', gameInfo.countdown);
    expect(mockSet).toHaveBeenCalledWith('nameState', gameInfo.gameName);
    expect(mockSet).toHaveBeenCalledWith('bunchState', gameInfo.bunch);
    expect(mockSet).toHaveBeenCalledWith('playersState', gameInfo.players);
    expect(mockSet).toHaveBeenCalledWith('handsState', gameInfo.hands);
    expect(mockSet).toHaveBeenCalledWith('boardsState', gameInfo.boards);
  });
});
