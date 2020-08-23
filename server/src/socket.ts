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

    socket.on(
      'createGame',
      ({ gameName, username, isShortenedGame }, callback) => {
        handler(() => {
          gameController = GameController.createGame(
            gameName,
            username,
            isShortenedGame,
            io,
            socket
          );
          return gameController.getCurrentGame().toJSON();
        }, callback);
      }
    );

    socket.on('joinGame', ({ gameId, username }, callback) => {
      handler(() => {
        gameController = GameController.joinGame(gameId, username, io, socket);
        return gameController.getCurrentGame().toJSON();
      }, callback);
    });

    socket.on('kickPlayer', ({ userId }, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).kickPlayer(userId);
      }, callback);
    });

    socket.on('leaveGame', ({}, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).leaveGame();
        gameController = undefined;
      }, callback);
    });

    socket.on('ready', ({ isReady }, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).setReady(isReady);
      }, callback);
    });

    socket.on('peel', ({}, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).peel();
      }, callback);
    });

    socket.on('dump', ({ tileId, boardLocation }, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).dump(tileId, boardLocation);
      }, callback);
    });

    socket.on(
      'moveTileFromHandToBoard',
      ({ tileId, boardLocation }, callback) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).moveTileFromHandToBoard(
            tileId,
            boardLocation
          );
        }, callback);
      }
    );

    socket.on('moveTileFromBoardToHand', ({ boardLocation }, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).moveTileFromBoardToHand(
          boardLocation
        );
      }, callback);
    });

    socket.on('moveAllTilesFromBoardToHand', ({}, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).moveAllTilesFromBoardToHand();
      }, callback);
    });

    socket.on('moveTileOnBoard', ({ fromLocation, toLocation }, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).moveTileOnBoard(
          fromLocation,
          toLocation
        );
      }, callback);
    });

    socket.on('shuffleHand', ({}, callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).shuffleHand();
      }, callback);
    });

    socket.on('disconnect', () => {
      gameController?.leaveGame();
      gameController = undefined;
      console.log(`${userId} disconnected`);
    });
  });
};
