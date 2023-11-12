import { useToast } from "@chakra-ui/react";
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

export function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const toast = useToast();

  useEffect(() => {
    socket.on("notification", ({ message }: { message: string }) => {
      toast({ description: message });
    });

    return (): void => {
      socket.emit("disconnect");
    };
  }, [toast]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
SocketProvider.displayName = "SocketProvider";

export function useSocket(): SocketState {
  return useContext(SocketContext);
}
