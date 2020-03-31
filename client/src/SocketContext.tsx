import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export type Callback<T> = (error: Error | null, data: T) => void;

export type GameId = string;
export type GameName = string;
export type Username = string;

type SocketState = {
  currentUsername: Username;
  createGame: (
    { gameName, username }: { gameName: GameName; username: Username },
    callback?: Callback<GameId>
  ) => void;
  joinGame: (
    { gameId, username }: { gameId: GameId; username: Username },
    callback?: Callback<null>
  ) => void;
  leaveGame: (
    { gameId }: { gameId: GameId },
    callback?: Callback<null>
  ) => void;
};

const SOCKET_URL = 'http://localhost:5000';
let socket: SocketIOClient.Socket;

export const SocketContext = createContext<SocketState>({
  currentUsername: '',
  createGame: () => undefined,
  joinGame: () => undefined,
  leaveGame: () => undefined,
});

export const SocketProvider: React.FC<{}> = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    socket = io(SOCKET_URL);

    return (): void => {
      socket.emit('disconnect');
    };
  }, []);

  const createGame = (
    { gameName, username }: { gameName: GameName; username: Username },
    callback?: Callback<GameId>
  ): void => {
    const createGameCallback: Callback<GameId> = (error, gameId) => {
      if (!error) {
        setCurrentUsername(username);
      }
      callback?.(error, gameId);
    };
    socket.emit('createGame', { gameName, username }, createGameCallback);
  };

  const joinGame = (
    { gameId, username }: { gameId: GameId; username: Username },
    callback?: Callback<null>
  ): void => {
    const joinGameCallback: Callback<null> = (error) => {
      if (!error) {
        setCurrentUsername(username);
      }
      callback?.(error, null);
    };
    socket.emit('joinGame', { gameId, username }, joinGameCallback);
  };

  const leaveGame = (
    { gameId }: { gameId: GameId },
    callback?: Callback<null>
  ): void => {
    const leaveGameCallback: Callback<null> = (error) => {
      if (!error) {
        setCurrentUsername('');
      }
      callback?.(error, null);
    };
    socket.emit('leaveGame', { gameId }, leaveGameCallback);
  };

  return (
    <SocketContext.Provider
      value={{ currentUsername, createGame, joinGame, leaveGame }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketState => useContext(SocketContext);
