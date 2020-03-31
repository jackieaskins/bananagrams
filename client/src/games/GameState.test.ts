import { useEffect } from 'react';

import { useGame } from './GameState';

const mockLeaveGame = jest.fn().mockName('leaveGame');

jest.mock('react', () => ({
  useEffect: jest.fn((f) => f()),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    search: '?id=gameId',
  }),
}));

jest.mock('../SocketContext', () => ({
  useSocket: () => ({
    leaveGame: mockLeaveGame,
  }),
}));

describe('GameState', () => {
  describe('useGame', () => {
    test('returns correct state', () => {
      expect(useGame()).toMatchInlineSnapshot(`
        Object {
          "gameId": "gameId",
        }
      `);
    });

    describe('useEffect', () => {
      test('returns a function that leaves the game', () => {
        useGame();

        useEffect.mock.calls[0][0]()();

        expect(mockLeaveGame).toHaveBeenCalledWith({ gameId: 'gameId' });
      });
    });
  });
});
