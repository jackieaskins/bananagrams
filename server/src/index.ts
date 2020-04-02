import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import router from './router';
import GameController from './controllers/GameController';

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

  console.log(`New connection: ${userId}`);

  const gameController = new GameController({ socket });

  socket.on('createGame', ({ gameName, username }, callback) => {
    try {
      const gameState = gameController.createGame({ gameName, username });
      callback(null, gameState);
    } catch ({ message }) {
      console.log(message);
      callback({ message }, null);
    }
  });

  socket.on('joinGame', ({ gameId, username }, callback) => {
    try {
      const gameState = gameController.joinGame({
        gameId,
        username,
        owner: false,
      });
      callback(null, gameState);
    } catch ({ message }) {
      console.log(message);
      callback({ message }, null);
    }
  });

  socket.on('leaveGame', ({}, callback) => {
    try {
      gameController.leaveGame();
      callback(null, null);
    } catch ({ message }) {
      console.log(message);
      callback({ message }, null);
    }
  });

  socket.on('disconnect', () => {
    gameController.leaveGame();
    console.log(`${userId} disconnected`);
  });
});
