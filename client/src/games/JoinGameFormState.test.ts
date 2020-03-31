import { useState } from 'react';

import { useJoinGameForm } from './JoinGameFormState';

const mockSetIsJoiningGame = jest.fn().mockName('setIsJoiningGame');
const mockSetUsername = jest.fn().mockName('setUsername');
const mockSetError = jest.fn().mockName('setError');
const mockJoinGame = jest.fn().mockName('joinGame');

jest.mock('react', () => ({
  useState: jest.fn(),
}));

jest.mock('../SocketContext', () => ({
  useSocket: () => ({
    joinGame: mockJoinGame,
  }),
}));

const gameId = 'gameId';

describe('JoinGameFormState', () => {
  beforeEach(() => {
    useState
      .mockReturnValueOnce([true, mockSetIsJoiningGame])
      .mockReturnValueOnce(['username', mockSetUsername])
      .mockReturnValueOnce(['error', mockSetError]);
  });

  describe('useJoinGameForm', () => {
    test('returns correct values', () => {
      expect(useJoinGameForm({ gameId })).toMatchInlineSnapshot(`
        Object {
          "error": "error",
          "isJoiningGame": true,
          "onSubmit": [Function],
          "setUsername": [MockFunction setUsername],
          "username": "username",
        }
      `);
    });

    describe('onSubmit', () => {
      beforeEach(() => {
        useJoinGameForm({ gameId }).onSubmit();
      });

      test('sets joining game to true', () => {
        expect(mockSetIsJoiningGame).toHaveBeenCalledWith(true);
      });

      test('calls joinGame', () => {
        expect(mockJoinGame).toHaveBeenCalledWith(
          {
            gameId: 'gameId',
            username: 'username',
          },
          expect.any(Function)
        );
      });

      describe('joinGame callback', () => {
        const joinGameCallback = (error) =>
          mockJoinGame.mock.calls[0][1](error);

        test('sets the error message on error', () => {
          const message = 'Error';
          joinGameCallback({ message });

          expect(mockSetError).toHaveBeenCalledWith(message);
        });

        test('sets joining game to false', () => {
          joinGameCallback({ message: 'Error' });

          expect(mockSetIsJoiningGame).toHaveBeenCalledWith(false);
        });
      });
    });
  });
});
