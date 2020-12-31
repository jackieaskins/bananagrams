import { atom, selector } from 'recoil';

import { playerFixture } from '../fixtures/player';
import { GameState, initializeState } from './state';

const mockGameStatus = 'STARTING';
const mockGameCountdown = 3;
const mockGameName = 'gameName';
const mockGamePlayers = [
  playerFixture({ userId: '1' }),
  playerFixture({ userId: '2' }),
];
const mockGameHands = { 1: [] };
const mockGameBoards = { 1: [[null]] };
const mockAtom = atom as jest.Mock;
const mockSelector = selector as jest.Mock;
jest.mock('recoil', () => ({
  ...jest.requireActual<any>('recoil'),
  atom: jest.fn(),
  selector: jest.fn(),
}));

jest.mock('../socket', () => ({
  getUserId: jest.fn().mockReturnValue('1'),
}));

describe('game state', () => {
  let state: GameState;
  beforeEach(() => {
    mockAtom
      .mockReturnValueOnce(mockGameStatus)
      .mockReturnValueOnce(mockGameCountdown)
      .mockReturnValueOnce(mockGameName)
      .mockReturnValueOnce(mockGamePlayers)
      .mockReturnValueOnce(mockGameHands)
      .mockReturnValueOnce(mockGameBoards);
    mockSelector
      .mockReturnValueOnce(mockGamePlayers[0])
      .mockReturnValueOnce(mockGameHands['1'])
      .mockReturnValueOnce(mockGameBoards['1']);
    state = initializeState();
  });

  describe('statusState', () => {
    test('returns statusState', () => {
      expect(state.statusState).toEqual(mockGameStatus);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameStatus',
        default: 'NOT_STARTED',
      });
    });
  });

  describe('countdownState', () => {
    test('returns countdownState', () => {
      expect(state.countdownState).toEqual(mockGameCountdown);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameCountdown',
        default: 0,
      });
    });
  });

  describe('nameState', () => {
    test('returns nameState', () => {
      expect(state.nameState).toEqual(mockGameName);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameName',
        default: '',
      });
    });
  });

  describe('playersState', () => {
    test('returns playersState', () => {
      expect(state.playersState).toEqual(mockGamePlayers);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gamePlayers',
        default: [],
      });
    });
  });

  describe('currentPlayerState', () => {
    test('returns currentPlayerState', () => {
      expect(state.currentPlayerState).toEqual(mockGamePlayers[0]);
    });

    test('calls atom with correct props', () => {
      expect(mockSelector).toHaveBeenCalledWith({
        key: 'gameCurrentPlayerState',
        get: expect.any(Function),
      });
    });

    test('gets current player from players state', () => {
      const mockGet = jest.fn().mockImplementation((state) => state);

      expect(mockSelector.mock.calls[0][0].get({ get: mockGet })).toEqual(
        mockGamePlayers[0]
      );
    });

    test('returns null if no current player', () => {
      const mockGet = jest.fn().mockReturnValue([]);

      expect(mockSelector.mock.calls[0][0].get({ get: mockGet })).toBeNull();
    });
  });

  describe('handsState', () => {
    test('returns handsState', () => {
      expect(state.handsState).toEqual(mockGameHands);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameHands',
        default: {},
      });
    });
  });

  describe('currentHandState', () => {
    test('returns currentHandState', () => {
      expect(state.currentHandState).toEqual(mockGameHands['1']);
    });

    test('calls atom with correct props', () => {
      expect(mockSelector).toHaveBeenCalledWith({
        key: 'gameCurrentHandState',
        get: expect.any(Function),
      });
    });

    test('gets current hand from hands state', () => {
      const mockGet = jest.fn().mockImplementation((state) => state);

      expect(mockSelector.mock.calls[1][0].get({ get: mockGet })).toEqual(
        mockGameHands['1']
      );
    });

    test('returns null if no current hand', () => {
      const mockGet = jest.fn().mockReturnValue([]);

      expect(mockSelector.mock.calls[1][0].get({ get: mockGet })).toBeNull();
    });
  });

  describe('boardsState', () => {
    test('returns boardsState', () => {
      expect(state.boardsState).toEqual(mockGameBoards);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameBoards',
        default: {},
      });
    });
  });

  describe('currentBoardState', () => {
    test('returns currentBoardState', () => {
      expect(state.currentBoardState).toEqual(mockGameBoards['1']);
    });

    test('calls atom with correct props', () => {
      expect(mockSelector).toHaveBeenCalledWith({
        key: 'gameCurrentBoardState',
        get: expect.any(Function),
      });
    });

    test('gets current board from boards state', () => {
      const mockGet = jest.fn().mockImplementation((state) => state);

      expect(mockSelector.mock.calls[2][0].get({ get: mockGet })).toEqual(
        mockGameBoards['1']
      );
    });

    test('returns null if no current board', () => {
      const mockGet = jest.fn().mockReturnValue([]);

      expect(mockSelector.mock.calls[2][0].get({ get: mockGet })).toBeNull();
    });
  });
});
