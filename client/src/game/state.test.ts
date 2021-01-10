import { atom, atomFamily, selector } from 'recoil';

import { playerFixture } from '../fixtures/player';
import { GameState, initializeState } from './state';

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
  const tile = { id: 'A1', letter: 'A' };
  const players = [
    playerFixture({ userId: '1' }),
    playerFixture({ userId: '2' }),
  ];
  const bunch = [tile];
  const board = { '1,1': null };
  const atomCalls: Array<[keyof GameState, string, any, any]> = [
    ['statusState', 'gameStatus', 'NOT_STARTED', 'STARTING'],
    ['countdownState', 'gameCountdown', 0, 3],
    ['nameState', 'gameName', '', 'gameName'],
    ['bunchState', 'gameBunch', [], [tile]],
    ['playersState', 'gamePlayers', [], players],
    ['handsState', 'gameHands', {}, { 1: [tile] }],
    ['currentHandState', 'gameCurrentHand', [], [tile]],
    ['boardsState', 'gameBoards', {}, { 1: board }],
    ['currentBoardState', 'gameCurrentBoard', {}, board],
  ];
  const atomFamilyCalls: Array<[keyof GameState, string, any, any]> = [
    ['currentBoardSquaresState', 'gameCurrentBoardSquares', null, board],
  ];

  beforeEach(() => {
    atomCalls.forEach(([, , , val]) => mockAtom.mockReturnValueOnce(val));
    atomFamilyCalls.forEach(([, , , val]) =>
      mockAtomFamily.mockReturnValueOnce(() => val)
    );
    mockSelector
      .mockReturnValueOnce(bunch.length)
      .mockReturnValueOnce(players[0]);

    state = initializeState();
  });

  describe.each(atomCalls)('atom - %s', (key, stateKey, defaultVal, val) => {
    it('returns correct state', () => {
      expect(state[key]).toEqual(val);
    });

    it('calls atom with correct props', () => {
      expect(mockAtom).toHaveBeenCalledWith({
        key: stateKey,
        default: defaultVal,
      });
    });
  });

  describe.each(atomFamilyCalls)(
    'atomFamily - %s',
    (key, stateKey, defaultVal, val) => {
      it('returns correct state fn', () => {
        expect((state[key] as () => any)()).toEqual(val);
      });

      it('calls atomFamily with correct props', () => {
        expect(mockAtomFamily).toHaveBeenCalledWith({
          key: stateKey,
          default: defaultVal,
        });
      });
    }
  );

  describe('selector - bunchCountState', () => {
    it('returns bunchCountState', () => {
      expect(state.bunchCountState).toEqual(bunch.length);
    });

    it('calls selector with correct props', () => {
      expect(mockSelector).toHaveBeenCalledWith({
        key: 'bunchCount',
        get: expect.any(Function),
      });
    });

    it('gets length of bunch', () => {
      const mockGet = jest.fn().mockImplementation((state) => state);

      expect(mockSelector.mock.calls[0][0].get({ get: mockGet })).toEqual(
        bunch.length
      );
    });
  });

  describe('selector - currentPlayerState', () => {
    it('returns currentPlayerState', () => {
      expect(state.currentPlayerState).toEqual(players[0]);
    });

    it('calls selector with correct props', () => {
      expect(mockSelector).toHaveBeenCalledWith({
        key: 'gameCurrentPlayer',
        get: expect.any(Function),
      });
    });

    it('gets current player from players state', () => {
      const mockGet = jest.fn().mockImplementation((state) => state);

      expect(mockSelector.mock.calls[1][0].get({ get: mockGet })).toEqual(
        players[0]
      );
    });

    it('returns null if no current player', () => {
      const mockGet = jest.fn().mockReturnValue([]);

      expect(mockSelector.mock.calls[1][0].get({ get: mockGet })).toBeNull();
    });
  });
});
