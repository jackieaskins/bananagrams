import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/socket";
import { DEV } from "../env";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = DEV
  ? io("http://localhost:3000")
  : io();
