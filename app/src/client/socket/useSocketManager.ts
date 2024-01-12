import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { socket } from ".";
import { ServerToClientEventName } from "@/types/socket";

export default function useSocketManager(): void {
  const toast = useToast();

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
}
