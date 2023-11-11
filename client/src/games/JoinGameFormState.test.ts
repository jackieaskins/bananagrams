import React from 'react';
import { useJoinGameForm } from './JoinGameFormState';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => ({
    gameId: 'gameId',
  }),
  useNavigate: () => mockNavigate,
}));

const mockEmit = jest.fn();
jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: {
      emit: mockEmit,
    },
  }),
}));

describe('useJoinGameForm', () => {
  const mockSetUsername = jest.fn().mockName('setUsername');
  const mockSetError = jest.fn().mockName('setError');
  const mockSetIsJoiningGame = jest.fn().mockName('setIsJoiningGame');

  beforeEach(() => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce((initialValue) => [initialValue, mockSetUsername])
      .mockImplementationOnce((initialValue) => [initialValue, mockSetError])
      .mockImplementationOnce((initialValue) => [
        initialValue,
        mockSetIsJoiningGame,
      ]);
  });

  test('has correct default state', () => {
    expect(useJoinGameForm()).toMatchSnapshot();
  });

  describe('onSubmit', () => {
    const event = { preventDefault: jest.fn() };

    beforeEach(() => {
      useJoinGameForm().onSubmit(event);
    });

    test('prevents default event', () => {
      expect(event.preventDefault).toHaveBeenCalledWith();
    });

    test('sets is joining game', () => {
      expect(mockSetIsJoiningGame).toHaveBeenCalledWith(true);
    });

    test('emits join game event to socket', () => {
      expect(mockEmit).toHaveBeenCalledWith(
        'joinGame',
        { gameId: 'gameId', username: '' },
        expect.any(Function)
      );
    });

    describe('socket joinGame callback', () => {
      describe('on error', () => {
        beforeEach(() => {
          mockEmit.mock.calls[0][2](new Error('error'), {});
        });

        test('sets error in state', () => {
          expect(mockSetError).toHaveBeenCalledWith('error');
        });

        test('sets is joining game to false', () => {
          expect(mockSetIsJoiningGame).toHaveBeenCalledWith(false);
        });
      });

      describe('on success', () => {
        const gameInfo = { gameId: 'gameId' };

        beforeEach(() => {
          mockEmit.mock.calls[0][2](null, gameInfo);
        });

        test('redirects to game with state', () => {
          expect(mockNavigate).toHaveBeenCalledWith('/game/gameId', {
            state: { isInGame: true, gameInfo },
          });
        });
      });
    });
  });
});
