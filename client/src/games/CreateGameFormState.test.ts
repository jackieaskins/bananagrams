import { useState } from 'react';
import { useCreateGameForm } from './CreateGameFormState';

const mockSetGameName = jest.fn().mockName('setGameName');
const mockSetUsername = jest.fn().mockName('setUsername');
const mockSetError = jest.fn().mockName('setError');
const mockSetIsCreatingGame = jest.fn().mockName('setIsCreatingGame');
const mockPush = jest.fn().mockName('push');
const mockCreateGame = jest.fn().mockName('createGame');

jest.mock('react', () => ({
  useState: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

jest.mock('../SocketContext', () => ({
  useSocket: () => ({
    createGame: mockCreateGame,
  }),
}));

describe('CreateGameFormState', () => {
  beforeEach(() => {
    useState
      .mockReturnValueOnce(['gameName', mockSetGameName])
      .mockReturnValueOnce(['username', mockSetUsername])
      .mockReturnValueOnce(['error', mockSetError])
      .mockReturnValueOnce([true, mockSetIsCreatingGame]);
  });

  describe('useCreateGameForm', () => {
    test('returns correct values', () => {
      expect(useCreateGameForm()).toMatchInlineSnapshot(`
        Object {
          "error": "error",
          "gameName": "gameName",
          "isCreatingGame": true,
          "onSubmit": [Function],
          "setGameName": [MockFunction setGameName],
          "setUsername": [MockFunction setUsername],
          "username": "username",
        }
      `);
    });

    describe('onSubmit', () => {
      beforeEach(() => {
        useCreateGameForm().onSubmit();
      });

      test('sets creating game to true', () => {
        expect(mockSetIsCreatingGame).toHaveBeenCalledWith(true);
      });

      test('calls createGame', () => {
        expect(mockCreateGame).toHaveBeenCalledWith(
          {
            gameName: 'gameName',
            username: 'username',
          },
          expect.any(Function)
        );
      });

      describe('createGame callback', () => {
        const createGameCallback = (error, gameId) =>
          mockCreateGame.mock.calls[0][1](error, gameId);

        test('sets the error message on error', () => {
          const message = 'Error';
          createGameCallback({ message }, null);

          expect(mockSetError).toHaveBeenCalledWith(message);
        });

        test('sets creating game to false on error', () => {
          createGameCallback({ message: 'Error' }, null);

          expect(mockSetIsCreatingGame).toHaveBeenCalledWith(false);
        });

        test('rediects to the newly created game on success', () => {
          createGameCallback(null, 'gameId');

          expect(mockPush).toHaveBeenCalledWith('/game?id=gameId');
        });
      });
    });
  });
});
