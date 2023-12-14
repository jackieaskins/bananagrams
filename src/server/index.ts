import express from "express";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import Dictionary from "./dictionary/Dictionary";
import { configureSocket } from "./socket";

const PORT = Number.parseInt(process.env.PORT || "3000");
Dictionary.initialize();

const app = express();

const server = ViteExpress.listen(app, PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

const io = new Server(server);
configureSocket(io);
