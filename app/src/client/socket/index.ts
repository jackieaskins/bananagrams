import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});
