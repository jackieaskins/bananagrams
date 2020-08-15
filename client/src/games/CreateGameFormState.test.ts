import React from 'react';
import { useCreateGameForm } from './CreateGameFormState';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

const mockEmit = jest.fn();
jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: {
      emit: mockEmit,
    },
  }),
}));

describe('useCreateGameForm', () => {
  const mockSetGameName = jest.fn().mockName('setGameName');
  const mockSetUsername = jest.fn().mockName('setUsername');
  const mockSetError = jest.fn().mockName('setError');
  const mockSetIsCreatingGame = jest.fn().mockName('setIsCreatingGame');

  beforeEach(() => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce((initialValue) => [initialValue, mockSetGameName])
      .mockImplementationOnce((initialValue) => [initialValue, mockSetUsername])
      .mockImplementationOnce((initialValue) => [initialValue, mockSetError])
      .mockImplementationOnce((initialValue) => [
        initialValue,
        mockSetIsCreatingGame,
      ]);
  });

  test('has correct default state', () => {
    expect(useCreateGameForm()).toMatchSnapshot();
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      useCreateGameForm().onSubmit();
    });

    test('sets is creating game', () => {
      expect(mockSetIsCreatingGame).toHaveBeenCalledWith(true);
    });

    test('emits create game event to socket', () => {
      expect(mockEmit).toHaveBeenCalledWith(
        'createGame',
        { gameName: '', username: '' },
        expect.any(Function)
      );
    });

    describe('socket createGame callback', () => {
      describe('on error', () => {
        beforeEach(() => {
          mockEmit.mock.calls[0][2](new Error('error'), {});
        });

        test('sets error in state', () => {
          expect(mockSetError).toHaveBeenCalledWith('error');
        });

        test('sets is creating game to false', () => {
          expect(mockSetIsCreatingGame).toHaveBeenCalledWith(false);
        });
      });

      describe('on success', () => {
        const gameInfo = { gameId: 'gameId' };

        beforeEach(() => {
          mockEmit.mock.calls[0][2](null, gameInfo);
        });

        test('redirects to game with state', () => {
          expect(mockPush).toHaveBeenCalledWith('/game/gameId', {
            isInGame: true,
            gameInfo,
          });
        });
      });
    });
  });
});
