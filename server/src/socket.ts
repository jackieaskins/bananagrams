/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Server } from 'socket.io';
import GameController from './controllers/GameController';

export const handler = (
  fn: () => Record<string, any> | void,
  callback?: (
    error: { message: string } | null,
    data: Record<string, any> | null
  ) => void
): void => {
  try {
    const returnValue = fn() || null;
    callback?.(null, returnValue);
  } catch ({ message }) {
    callback?.({ message }, null);
  }
};

export const configureSocket = (io: Server): void => {
  io.on('connection', (socket) => {
    const { id: userId } = socket;

    console.log(`New connection: ${userId}`);

    let gameController: GameController | undefined;

    const validateGameControllerExists = (): void => {
      if (!gameController) {
        throw new Error('Not in a game');
      }
    };

    socket.on('createGame', ({ gameName, username }, callback) => {
      handler(() => {
        gameController = GameController.createGame(
          gameName,
          username,
          io,
          socket
        );
        return gameController.getCurrentGame().toJSON();
      }, callback);
    });

    socket.on('joinGame', ({ gameId, username }, callback) => {
      handler(() => {
        gameController = GameController.joinGame(gameId, username, io, socket);
        return gameController.getCurrentGame().toJSON();
      }, callback);
    });

    socket.on('leaveGame', ({}, callback) => {
      handler(() => {
        validateGameControllerExists();
        gameController!.leaveGame();
        gameController = undefined;
      }, callback);
    });

    socket.on('ready', ({ isReady }, callback) => {
      handler(() => {
        validateGameControllerExists();
        gameController!.setReady(isReady);
      }, callback);
    });

    socket.on('peel', ({}, callback) => {
      handler(() => {
        validateGameControllerExists();
        gameController!.peel();
      }, callback);
    });

    socket.on('dump', ({ tileId, boardLocation }, callback) => {
      handler(() => {
        validateGameControllerExists();
        gameController!.dump(tileId, boardLocation);
      }, callback);
    });

    socket.on(
      'moveTileFromHandToBoard',
      ({ tileId, boardLocation }, callback) => {
        handler(() => {
          validateGameControllerExists();
          gameController!.moveTileFromHandToBoard(tileId, boardLocation);
        }, callback);
      }
    );

    socket.on('moveTileFromBoardToHand', ({ boardLocation }, callback) => {
      handler(() => {
        validateGameControllerExists();
        gameController!.moveTileFromBoardToHand(boardLocation);
      }, callback);
    });

    socket.on('moveTileOnBoard', ({ fromLocation, toLocation }, callback) => {
      handler(() => {
        validateGameControllerExists();
        gameController!.moveTileOnBoard(fromLocation, toLocation);
      }, callback);
    });

    socket.on('disconnect', () => {
      gameController?.leaveGame();
      gameController = undefined;
      console.log(`${userId} disconnected`);
    });
  });
};
