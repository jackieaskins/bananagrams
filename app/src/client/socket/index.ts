import { Socket, io } from "socket.io-client";
import { DEV } from "@/client/env";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = DEV
  ? io("http://localhost:3000")
  : io();
