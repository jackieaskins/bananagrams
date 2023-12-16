import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { ServerToClientEventName } from "../../types/socket";
import { socket } from ".";

export default function SocketManager(): null {
  const toast = useToast();

  useEffect(
    () => () => {
      socket.disconnect();
    },
    [],
  );

  useEffect(() => {
    socket.on(
      ServerToClientEventName.Notification,
      ({ message }: { message: string }) => {
        toast({ description: message });
      },
    );

    return (): void => {
      socket.off(ServerToClientEventName.Notification);
    };
  }, [toast]);

  return null;
}
