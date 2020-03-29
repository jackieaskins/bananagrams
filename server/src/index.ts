import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import router from './router';
import Game from './models/Game';
import Player from './models/Player';

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

io.on('connection', (socket) => {
  const { id: userId } = socket;

  const logGamesAndUsers = (method: string): void => {
    console.log(
      method,
      userId,
      JSON.stringify(
        { games: Game.getGames(), players: Player.getPlayers() },
        null,
        2
      )
    );
  };

  console.log(`New connection: ${userId}`);
  logGamesAndUsers('connection');

  socket.on('createGame', ({ gameName, username }, callback) => {
    try {
      const player = Player.getPlayer({ userId });
      if (player) {
        player.delete();
        socket.leave(player.getGameId());
      }

      const gameId = new Game({ name: gameName }).getId();
      new Player({ userId, gameId, username, owner: true });
      socket.join(gameId);

      logGamesAndUsers('createGame');

      callback(null, gameId);
    } catch ({ message }) {
      callback({ message }, null);
    }
  });

  socket.on('joinGame', ({ gameId, username }, callback) => {
    try {
      const player = Player.getPlayer({ userId });
      if (player) {
        player.setUsername(username);

        logGamesAndUsers('joinGame');
        return callback(null, null);
      }

      new Player({ userId, gameId, username, owner: false });
      socket.join(gameId);

      logGamesAndUsers('joinGame');

      callback(null, null);
    } catch ({ message }) {
      callback({ message }, null);
    }
  });

  socket.on('leaveGame', ({}, callback) => {
    try {
      const player = Player.getPlayer({ userId });
      if (player) {
        player.delete();
        socket.leave(player.getGameId());
      }

      logGamesAndUsers('leaveGame');

      callback(null, null);
    } catch ({ message }) {
      callback({ message }, null);
    }
  });

  socket.on('disconnect', () => {
    try {
      const player = Player.getPlayer({ userId });
      if (player) {
        player.delete();
        socket.leave(player.getGameId());
      }

      logGamesAndUsers('disconnect');
    } catch (err) {}
  });
});
