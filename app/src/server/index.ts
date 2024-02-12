import express from "express";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import GameController from "./controllers/GameController";
import Dictionary from "./dictionary/Dictionary";
import { configureSocket } from "./socket";

const PORT = Number.parseInt(process.env.PORT || "3000");
Dictionary.initialize();

const app = express();

app.get("/server/stats", (_, res) =>
  res.send({
    gameCount: Object.keys(GameController.getGames()).length,
  }),
);

const server = ViteExpress.listen(app, PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server has started on port ${PORT}`);
});

const io = new Server(server);
configureSocket(io);
