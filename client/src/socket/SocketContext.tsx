import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import socket from "./index";

export type Callback<T> = (error: Error | null, data: T) => void;

type SocketState = {
  socket: Socket;
};

export const SocketContext = createContext<SocketState>({
  socket,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket.on("notification", ({ message }: { message: string }) => {
      enqueueSnackbar(message);
    });

    return (): void => {
      socket.emit("disconnect");
    };
  }, [enqueueSnackbar]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
SocketProvider.displayName = "SocketProvider";

export const useSocket = (): SocketState => useContext(SocketContext);
