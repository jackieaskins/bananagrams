import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../types/socket";

const SOCKET_URL = "http://localhost:3000";
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  process.env.NODE_ENV === "development" ? io(SOCKET_URL) : io();
