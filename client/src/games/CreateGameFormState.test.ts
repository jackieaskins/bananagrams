import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCreateGameForm } from './CreateGameFormState';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
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
    useLocation.mockReturnValue({
      search: '',
    });
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
    test('sets is creating game', () => {
      useCreateGameForm().onSubmit();

      expect(mockSetIsCreatingGame).toHaveBeenCalledWith(true);
    });

    test('emits create game event to socket', () => {
      useCreateGameForm().onSubmit();

      expect(mockEmit).toHaveBeenCalledWith(
        'createGame',
        { gameName: '', username: '', isShortenedGame: false },
        expect.any(Function)
      );
    });

    test('creates shortened game if query param is present', () => {
      useLocation.mockReturnValue({ search: '?isShortenedGame=true' });
      useCreateGameForm().onSubmit();

      expect(mockEmit.mock.calls[0][1]).toEqual({
        gameName: '',
        username: '',
        isShortenedGame: true,
      });
    });

    describe('socket createGame callback', () => {
      beforeEach(() => {
        useCreateGameForm().onSubmit();
      });

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
