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

app.use('/assets', express.static('assets'));
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

  let gameController: GameController | undefined;

  socket.on('createGame', ({ gameName, username }, callback) => {
    try {
      gameController = GameController.createGame(
        gameName,
        username,
        io,
        socket
      );
      callback?.(null, gameController.getCurrentGame().toJSON());
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('joinGame', ({ gameId, username }, callback) => {
    try {
      gameController = GameController.joinGame(gameId, username, io, socket);
      callback?.(null, gameController.getCurrentGame().toJSON());
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('leaveGame', ({}, callback) => {
    if (!gameController) {
      return callback?.({ message: 'Not in a game' }, null);
    }

    try {
      gameController.leaveGame();
      gameController = undefined;
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('split', ({}, callback) => {
    if (!gameController) {
      return callback?.({ message: 'Not in a game' }, null);
    }

    try {
      gameController.split();
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('peel', ({}, callback) => {
    if (!gameController) {
      return callback?.({ message: 'Not in a game' }, null);
    }

    try {
      gameController.peel();
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('dump', ({ tileId, boardPosition }, callback) => {
    if (!gameController) {
      return callback?.({ message: 'Not in a game' }, null);
    }

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
      if (!gameController) {
        return callback?.({ message: 'Not in a game' }, null);
      }

      try {
        gameController.moveTileFromHandToBoard(tileId, boardPosition);
        callback?.(null, null);
      } catch ({ message }) {
        callback?.({ message }, null);
      }
    }
  );

  socket.on('moveTileFromBoardToHand', ({ boardPosition }, callback) => {
    if (!gameController) {
      return callback?.({ message: 'Not in a game' }, null);
    }

    try {
      gameController.moveTileFromBoardToHand(boardPosition);
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('moveTileOnBoard', ({ fromPosition, toPosition }, callback) => {
    if (!gameController) {
      return callback?.({ message: 'Not in a game' }, null);
    }

    try {
      gameController.moveTileOnBoard(fromPosition, toPosition);
      callback?.(null, null);
    } catch ({ message }) {
      callback?.({ message }, null);
    }
  });

  socket.on('disconnect', () => {
    gameController?.leaveGame();
    gameController = undefined;
    console.log(`${userId} disconnected`);
  });
});
