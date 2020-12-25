import { Server } from 'socket.io';

import GameController from './controllers/GameController';
import { BoardLocation } from './models/Board';

type Callback = (
  error: { message: string } | null,
  data: Record<string, any> | null
) => void;

export const handler = (
  fn: () => Record<string, any> | void,
  callback?: Callback
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
      (
        {
          gameName,
          username,
          isShortenedGame,
        }: { gameName: string; username: string; isShortenedGame: boolean },
        callback: Callback
      ) => {
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

    socket.on(
      'joinGame',
      (
        { gameId, username }: { gameId: string; username: string },
        callback: Callback
      ) => {
        handler(() => {
          gameController = GameController.joinGame(
            gameId,
            username,
            io,
            socket
          );
          return gameController.getCurrentGame().toJSON();
        }, callback);
      }
    );

    socket.on(
      'kickPlayer',
      ({ userId }: { userId: string }, callback?: Callback) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).kickPlayer(userId);
        }, callback);
      }
    );

    socket.on('leaveGame', ({}, callback?: Callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).leaveGame();
        gameController = undefined;
      }, callback);
    });

    socket.on(
      'ready',
      ({ isReady }: { isReady: boolean }, callback?: Callback) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).setReady(isReady);
        }, callback);
      }
    );

    socket.on('peel', ({}, callback?: Callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).peel();
      }, callback);
    });

    socket.on(
      'dump',
      (
        {
          tileId,
          boardLocation,
        }: { tileId: string; boardLocation: BoardLocation | null },
        callback?: Callback
      ) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).dump(tileId, boardLocation);
        }, callback);
      }
    );

    socket.on(
      'moveTileFromHandToBoard',
      (
        {
          tileId,
          boardLocation,
        }: { tileId: string; boardLocation: BoardLocation },
        callback?: Callback
      ) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).moveTileFromHandToBoard(
            tileId,
            boardLocation
          );
        }, callback);
      }
    );

    socket.on(
      'moveTileFromBoardToHand',
      (
        { boardLocation }: { boardLocation: BoardLocation },
        callback?: Callback
      ) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).moveTileFromBoardToHand(
            boardLocation
          );
        }, callback);
      }
    );

    socket.on('moveAllTilesFromBoardToHand', ({}, callback?: Callback) => {
      handler(() => {
        validateGameControllerExists();
        (gameController as GameController).moveAllTilesFromBoardToHand();
      }, callback);
    });

    socket.on(
      'moveTileOnBoard',
      (
        {
          fromLocation,
          toLocation,
        }: { fromLocation: BoardLocation; toLocation: BoardLocation },
        callback?: Callback
      ) => {
        handler(() => {
          validateGameControllerExists();
          (gameController as GameController).moveTileOnBoard(
            fromLocation,
            toLocation
          );
        }, callback);
      }
    );

    socket.on('shuffleHand', ({}, callback?: Callback) => {
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
