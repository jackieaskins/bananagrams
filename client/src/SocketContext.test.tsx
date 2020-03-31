import React, { useContext, useEffect } from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import io from 'socket.io-client';

import { useSocket, SocketContext, SocketProvider } from './SocketContext';

const mockCallback = jest.fn().mockName('callback');
const mockSetCurrentUsername = jest.fn().mockName('setCurrentUsername');

jest.mock('socket.io-client', () =>
  jest.fn().mockReturnValue({
    emit: jest.fn(),
  })
);

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockName('useContext'),
  useEffect: jest.fn((f) => f()),
  useState: jest.fn((currentUsername) => [
    currentUsername,
    mockSetCurrentUsername,
  ]),
}));

describe('SocketContext', () => {
  const renderer = ShallowRenderer.createRenderer();
  const mockSocket = io();

  const renderComponent = () => renderer.render(<SocketProvider />);
  const getComponent = () => renderer.getRenderOutput();

  describe('SocketProvider', () => {
    beforeEach(() => {
      renderComponent();
    });

    describe('createGame', () => {
      const createGameParams = {
        gameName: 'gameName',
        username: 'username',
      };
      const createGame = () =>
        getComponent().props.value.createGame(createGameParams, mockCallback);

      beforeEach(() => {
        createGame();
      });

      test('emits createGame event', () => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'createGame',
          createGameParams,
          expect.any(Function)
        );
      });

      describe('callback', () => {
        const createGameCallback = (error, gameId) =>
          mockSocket.emit.mock.calls[0][2](error, gameId);

        test('sets current username if no error', () => {
          createGameCallback(null, 'gameId');
          expect(mockSetCurrentUsername).toHaveBeenCalledWith('username');
        });

        test('calls passed in callback', () => {
          const error = new Error('Error');
          const gameId = 'gameId';
          createGameCallback(error, gameId);

          expect(mockCallback).toHaveBeenCalledWith(error, gameId);
        });
      });
    });

    describe('joinGame', () => {
      const joinGameParams = {
        gameId: 'gameId',
        username: 'username',
      };
      const joinGame = () =>
        getComponent().props.value.joinGame(joinGameParams, mockCallback);

      beforeEach(() => {
        joinGame();
      });

      test('emits joinGame event', () => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'joinGame',
          joinGameParams,
          expect.any(Function)
        );
      });

      describe('callback', () => {
        const joinGameCallback = (error) =>
          mockSocket.emit.mock.calls[0][2](error);

        test('sets current username if no error', () => {
          joinGameCallback(null);
          expect(mockSetCurrentUsername).toHaveBeenCalledWith('username');
        });

        test('calls passed in callback', () => {
          const error = new Error('Error');
          joinGameCallback(error);

          expect(mockCallback).toHaveBeenCalledWith(error, null);
        });
      });
    });

    describe('leaveGame', () => {
      const leaveGameParams = {
        gameId: 'gameId',
      };
      const leaveGame = () =>
        getComponent().props.value.leaveGame(leaveGameParams, mockCallback);

      beforeEach(() => {
        leaveGame();
      });

      test('emits leaveGame event', () => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'leaveGame',
          leaveGameParams,
          expect.any(Function)
        );
      });

      describe('callback', () => {
        const leaveGameCallback = (error) =>
          mockSocket.emit.mock.calls[0][2](error);

        test('sets current username if no error', () => {
          leaveGameCallback(null);
          expect(mockSetCurrentUsername).toHaveBeenCalledWith('');
        });

        test('calls passed in callback', () => {
          const error = new Error('Error');
          leaveGameCallback(error);

          expect(mockCallback).toHaveBeenCalledWith(error, null);
        });
      });
    });

    describe('useEffect', () => {
      test('connects to the socket', () => {
        expect(io).toHaveBeenCalled();
      });

      test('disconnects on unmount', () => {
        useEffect.mock.calls[0][0]()();

        expect(mockSocket.emit).toHaveBeenCalledWith('disconnect');
      });
    });
  });

  describe('useSocket', () => {
    test('uses SocketContext', () => {
      useSocket();

      expect(useContext).toHaveBeenCalledWith(SocketContext);
    });
  });
});
