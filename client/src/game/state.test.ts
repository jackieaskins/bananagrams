import { atom, atomFamily, selector } from 'recoil';

import { playerFixture } from '../fixtures/player';
import { GameState, initializeState } from './state';

const mockGamePlayers = [
  playerFixture({ userId: '1' }),
  playerFixture({ userId: '2' }),
];
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
  const board = { '1,1': null };
  const atomCalls: Array<[keyof GameState, string, any, any]> = [
    ['statusState', 'gameStatus', 'NOT_STARTED', 'STARTING'],
    ['countdownState', 'gameCountdown', 0, 3],
    ['nameState', 'gameName', '', 'gameName'],
    ['bunchState', 'gameBunch', [], [tile]],
    [
      'playersState',
      'gamePlayers',
      [],
      [playerFixture({ userId: '1' }), playerFixture({ userId: '2' })],
    ],
    ['handsState', 'gameHands', {}, { 1: [tile] }],
    ['currentHandState', 'gameCurrentHandState', [], [tile]],
    ['boardsState', 'gameBoards', {}, { 1: board }],
    ['currentBoardState', 'gameCurrentBoardState', {}, board],
  ];
  const atomFamilyCalls: Array<[keyof GameState, string, any, any]> = [
    ['currentBoardSquaresState', 'gameCurrentBoardSquaresState', null, board],
  ];
  beforeEach(() => {
    atomCalls.forEach(([, , , val]) => mockAtom.mockReturnValueOnce(val));
    atomFamilyCalls.forEach(([, , , val]) =>
      mockAtomFamily.mockReturnValueOnce(() => val)
    );
    mockSelector.mockReturnValueOnce(mockGamePlayers[0]);

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

  describe('selector - currentPlayerState', () => {
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
});
