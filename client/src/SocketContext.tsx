import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

export type Callback<T> = (error: Error | null, data: T) => void;

type SocketState = {
  socket: SocketIOClient.Socket;
};

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL);

const SocketContext = createContext<SocketState>({
  socket,
});

export const SocketProvider: React.FC<{}> = ({ children }) => {
  useEffect(
    () => (): void => {
      socket.emit('disconnect');
    },
    []
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketState => useContext(SocketContext);
