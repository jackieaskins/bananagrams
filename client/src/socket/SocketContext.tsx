import { FunctionComponent, createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import socket from './index';

export type Callback<T> = (error: Error | null, data: T) => void;

type SocketState = {
  socket: Socket;
};

export const SocketContext = createContext<SocketState>({
  socket,
});

export const SocketProvider: FunctionComponent = ({ children }) => {
  useEffect(
    () => () => {
      socket.disconnect();
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
