import { atom, selector } from 'recoil';

import { playerFixture } from '../fixtures/player';
import { GameState, initializeState } from './state';

const mockGameInProgress = true;
const mockGameName = 'gameName';
const mockGamePlayers = [
  playerFixture({ userId: '1' }),
  playerFixture({ userId: '2' }),
];
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
      .mockReturnValueOnce(mockGameInProgress)
      .mockReturnValueOnce(mockGameName)
      .mockReturnValueOnce(mockGamePlayers);
    mockSelector.mockReturnValueOnce(mockGamePlayers[0]);
    state = initializeState();
  });

  describe('inProgressState', () => {
    test('returns inProgressState', () => {
      expect(state.inProgressState).toEqual(mockGameInProgress);
    });

    test('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: 'gameInProgress',
        default: false,
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
});
