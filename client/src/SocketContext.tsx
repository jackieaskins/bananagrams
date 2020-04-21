import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useSnackbar } from 'notistack';

export type Callback<T> = (error: Error | null, data: T) => void;

type SocketState = {
  socket: SocketIOClient.Socket;
};

const SOCKET_URL = 'http://localhost:5000';
const socket = process.env.NODE_ENV === 'development' ? io(SOCKET_URL) : io();

const SocketContext = createContext<SocketState>({
  socket,
});

export const SocketProvider: React.FC<{}> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket.on('notification', ({ message }: { message: string }) => {
      enqueueSnackbar(message);
    });

    return (): void => {
      socket.emit('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketState => useContext(SocketContext);
