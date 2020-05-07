import express from 'express';
import http from 'http';
import path from 'path';
import socketio from 'socket.io';

import { configureDevServer } from './devServer';
import GameController from './controllers/GameController';

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

if (process.env.NODE_ENV === 'development') {
  configureDevServer(app);
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

io.on('connection', (socket) => {
  const { id: userId } = socket;

  console.log(`New connection: ${userId}`);

  const gameController = new GameController(io, socket);

  socket.on('createGame', ({ gameName, username }, callback) => {
    try {
      const gameState = gameController.createGame(gameName, username);
      callback?.(null, gameState);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('joinGame', ({ gameId, username }, callback) => {
    try {
      const gameState = gameController.joinGame(gameId, username, false);
      callback?.(null, gameState);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('leaveGame', ({}, callback) => {
    try {
      gameController.leaveGame();
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('split', ({}, callback) => {
    try {
      gameController.split();
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('peel', ({}, callback) => {
    try {
      gameController.peel();
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('dump', ({ tileId, boardPosition }, callback) => {
    try {
      gameController.dump(tileId, boardPosition);
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on(
    'moveTileFromHandToBoard',
    ({ tileId, boardPosition }, callback) => {
      try {
        gameController.moveTileFromHandToBoard(tileId, boardPosition);
        callback?.(null, null);
      } catch ({ message }) {
        callback?.({ message }, null);
      }
    }
  );

  socket.on('moveTileFromBoardToHand', ({ boardPosition }, callback) => {
    try {
      gameController.moveTileFromBoardToHand(boardPosition);
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('moveTileOnBoard', ({ fromPosition, toPosition }, callback) => {
    try {
      gameController.moveTileOnBoard(fromPosition, toPosition);
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('disconnect', () => {
    gameController.leaveGame();
    console.log(`${userId} disconnected`);
  });
});
