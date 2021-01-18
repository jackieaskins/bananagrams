import { useRecoilValue, useSetRecoilState } from 'recoil';

import { BoardSquare, ValidationStatus } from '../board/types';
import { playerFixture } from '../fixtures/player';
import { GameInfo } from '../game/types';
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
  useGameBunchCount,
  useCurrentBoard,
  usePreviousSnapshot,
  useResetCurrentBoard,
  useResetGameState,
} from './stateHooks';

const mockSet = jest.fn();
const mockReset = jest.fn();
const mockSnapshot = {
  getPromise: jest.fn(),
};
const mockUseRecoilValue = useRecoilValue as jest.Mock;
const mockUseSetRecoilState = useSetRecoilState as jest.Mock;
const mockReturnValue = 'mockReturnValue';
const mockSetReturnValue = 'mockSetReturnValue';
jest.mock('recoil', () => ({
  useRecoilCallback: jest.fn((fn) =>
    fn({ set: mockSet, reset: mockReset, snapshot: mockSnapshot })
  ),
  useRecoilValue: jest.fn().mockReturnValue('mockReturnValue'),
  useSetRecoilState: jest.fn().mockReturnValue(() => mockSetReturnValue),
}));

jest.mock('./state', () => ({
  initializeState: jest.fn().mockReturnValue({
    statusState: 'statusState',
    countdownState: 'countdownState',
    nameState: 'nameState',
    bunchState: 'bunchState',
    bunchCountState: 'bunchCountState',
    playersState: 'playersState',
    currentPlayerState: 'currentPlayerState',
    handsState: 'handsState',
    currentHandState: 'currentHandState',
    boardsState: 'boardsState',
    currentBoardState: 'currentBoardState',
    currentBoardSquaresState: jest.fn((id) => `currentBoardSquaresState-${id}`),
    previousSnapshotState: 'previousSnapshotState',
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

  it('useGameBunchCount returns recoil value', () => {
    expect(useGameBunchCount()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('bunchCountState');
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
    expect(mockUseRecoilValue).toHaveBeenCalledWith(
      'currentBoardSquaresState-0,0'
    );
  });

  it('usePreviousSnapshot returns recoil value', () => {
    expect(usePreviousSnapshot()).toEqual(mockReturnValue);
    expect(mockUseRecoilValue).toHaveBeenCalledWith('previousSnapshotState');
  });

  describe('useSetCurrentBoard', () => {
    const boardSquare: BoardSquare = {
      tile: { id: 'A1', letter: 'A' },
      validationStatus: ValidationStatus.NOT_VALIDATED,
    };
    const board = {
      '0,0': boardSquare,
    };

    beforeEach(() => {
      useSetCurrentBoard()(board);
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

  describe('useResetCurrentBoard', () => {
    const boardSquare = {
      tile: { id: 'A1', letter: 'A' },
      validationStatus: 'NOT_VALIDATED',
    };
    const board = {
      '0,0': boardSquare,
      '0,1': boardSquare,
    };

    beforeEach(() => {
      mockSnapshot.getPromise.mockReturnValue(board);
      useResetCurrentBoard()();
    });

    it('resets current board', () => {
      expect(mockReset).toHaveBeenCalledWith('currentBoardState');
    });

    it('resets each board square', () => {
      expect(mockReset).toHaveBeenCalledWith('currentBoardSquaresState-0,0');
      expect(mockReset).toHaveBeenCalledWith('currentBoardSquaresState-0,1');
    });
  });

  it('useResetGameState resets game state through recoil callback', () => {
    useResetGameState()();

    expect(mockReset).toHaveBeenCalledTimes(8);

    expect(mockReset).toHaveBeenCalledWith('statusState');
    expect(mockReset).toHaveBeenCalledWith('countdownState');
    expect(mockReset).toHaveBeenCalledWith('nameState');
    expect(mockReset).toHaveBeenCalledWith('bunchState');
    expect(mockReset).toHaveBeenCalledWith('playersState');
    expect(mockReset).toHaveBeenCalledWith('handsState');
    expect(mockReset).toHaveBeenCalledWith('boardsState');
    expect(mockReset).toHaveBeenCalledWith('previousSnapshotState');
  });

  describe('useUpdateGameState', () => {
    const setPlayersIndex = 4;
    const userId = 'userId';
    const gameInfo: GameInfo = {
      gameId: 'gameId',
      gameName: 'gameName',
      status: 'IN_PROGRESS',
      bunch: [],
      countdown: 3,
      players: [playerFixture({ userId })],
      boards: { [userId]: {} },
      hands: { [userId]: [] },
      previousSnapshot: null,
    };

    beforeEach(() => {
      useUpdateGameState()(gameInfo);
    });

    it('sets 8 pieces of state', () => {
      expect(mockSet).toHaveBeenCalledTimes(8);
    });

    it.each([
      ['statusState', gameInfo.status],
      ['countdownState', gameInfo.countdown],
      ['nameState', gameInfo.gameName],
      ['bunchState', gameInfo.bunch],
      ['handsState', gameInfo.hands],
      ['boardsState', gameInfo.boards],
      ['previousSnapshotState', gameInfo.previousSnapshot],
    ])('sets %s', (stateKey, value) => {
      expect(mockSet).toHaveBeenCalledWith(stateKey, value);
    });

    describe('playersState', () => {
      it('does not update players if same by deep equality', () => {
        const currentPlayers = [...gameInfo.players];

        expect(mockSet.mock.calls[setPlayersIndex][1](currentPlayers)).toBe(
          currentPlayers
        );
      });

      it('updates players if changed', () => {
        const currentPlayers = [playerFixture()];

        expect(mockSet.mock.calls[setPlayersIndex][1](currentPlayers)).toEqual(
          gameInfo.players
        );
      });
    });
  });
});
