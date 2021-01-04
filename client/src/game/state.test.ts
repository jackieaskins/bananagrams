import { atom, atomFamily, selector } from 'recoil';

import { playerFixture } from '../fixtures/player';
import { Hand } from '../hands/types';
import { GameState, initializeState } from './state';

const mockGameStatus = 'STARTING';
const mockGameCountdown = 3;
const mockGameName = 'gameName';
const mockGamePlayers = [
  playerFixture({ userId: '1' }),
  playerFixture({ userId: '2' }),
];
const mockGameHands = { 1: [] };
const mockCurrentHand: Hand = [];
const mockGameBoards = { 1: [[null]] };
const mockCurrentBoard = null;
const mockAtom = atom as jest.Mock;
const mockAtomFamily = atomFamily as jest.Mock;
const mockSelector = selector as jest.Mock;
jest.mock('recoil', () => ({
  ...jest.requireActual<any>('recoil'),
  atom: jest.fn(),
  atomFamily: jest.fn(),
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
      .mockReturnValueOnce(mockCurrentHand)
      .mockReturnValueOnce(mockGameBoards);
    mockSelector.mockReturnValueOnce(mockGamePlayers[0]);
    mockAtomFamily.mockReturnValueOnce(mockCurrentBoard);
    state = initializeState();
  });

  describe('statusState', () => {
    it('returns statusState', () => {
      expect(state.statusState).toEqual(mockGameStatus);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameStatus',
        default: 'NOT_STARTED',
      });
    });
  });

  describe('countdownState', () => {
    it('returns countdownState', () => {
      expect(state.countdownState).toEqual(mockGameCountdown);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameCountdown',
        default: 0,
      });
    });
  });

  describe('nameState', () => {
    it('returns nameState', () => {
      expect(state.nameState).toEqual(mockGameName);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameName',
        default: '',
      });
    });
  });

  describe('playersState', () => {
    it('returns playersState', () => {
      expect(state.playersState).toEqual(mockGamePlayers);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gamePlayers',
        default: [],
      });
    });
  });

  describe('currentPlayerState', () => {
    it('returns currentPlayerState', () => {
      expect(state.currentPlayerState).toEqual(mockGamePlayers[0]);
    });

    it('calls selector with correct props', () => {
      expect(mockSelector).toHaveBeenCalledWith({
        key: 'gameCurrentPlayerState',
        get: expect.any(Function),
      });
    });

    it('gets current player from players state', () => {
      const mockGet = jest.fn().mockImplementation((state) => state);

      expect(mockSelector.mock.calls[0][0].get({ get: mockGet })).toEqual(
        mockGamePlayers[0]
      );
    });

    it('returns null if no current player', () => {
      const mockGet = jest.fn().mockReturnValue([]);

      expect(mockSelector.mock.calls[0][0].get({ get: mockGet })).toBeNull();
    });
  });

  describe('handsState', () => {
    it('returns handsState', () => {
      expect(state.handsState).toEqual(mockGameHands);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameHands',
        default: {},
      });
    });
  });

  describe('currentHandState', () => {
    it('returns currentHandState', () => {
      expect(state.currentHandState).toEqual(mockCurrentHand);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameCurrentHandState',
        default: [],
      });
    });
  });

  describe('boardsState', () => {
    it('returns boardsState', () => {
      expect(state.boardsState).toEqual(mockGameBoards);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameBoards',
        default: {},
      });
    });
  });

  describe('currentBoardState', () => {
    it('returns currentBoardState', () => {
      expect(state.currentBoardState).toEqual(mockCurrentBoard);
    });

    it('calls atom faily with correct props', () => {
      expect(mockAtomFamily).toHaveBeenCalledWith({
        key: 'gameCurrentBoardState',
        default: null,
      });
    });
  });
});
