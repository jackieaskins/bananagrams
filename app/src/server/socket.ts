import { Server } from "socket.io";
import GameController from "./controllers/GameController";
import {
  ClientToServerEventName,
  ClientToServerEvents,
  ServerToClientEvents,
  SocketCallback,
} from "@/types/socket";

export function handler<E, T>(fn: (event: E) => T) {
  return function (event: E, callback?: SocketCallback<T>): void {
    try {
      const returnValue = fn(event) || null;
      callback?.(null, returnValue);
    } catch (e) {
      const { message } = e as Error;
      callback?.({ message }, null);
    }
  };
}

export function configureSocket(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
): void {
  io.on("connection", (socket) => {
    const { id: userId } = socket;

    console.log(`New connection: ${userId}`);

    let gameController: GameController | undefined;

    function withController<E, T>(
      fn: (event: E, controller: GameController) => T,
    ) {
      return handler((event: E) => {
        if (!gameController) {
          throw new Error("Not in a game");
        }

        return fn(event, gameController);
      });
    }

    socket.on(
      ClientToServerEventName.CreateGame,
      handler(({ gameName, username, isShortenedGame }) => {
        gameController = GameController.createGame(
          gameName,
          username,
          isShortenedGame,
          io,
          socket,
        );
        return gameController.getCurrentGame().toJSON();
      }),
    );

    socket.on(
      ClientToServerEventName.JoinGame,
      handler(({ gameId, username, isSpectator }) => {
        gameController = GameController.joinGame(
          gameId,
          username,
          isSpectator,
          io,
          socket,
        );
        return gameController.getCurrentGame().toJSON();
      }),
    );

    socket.on(
      ClientToServerEventName.KickPlayer,
      withController(({ userId }, controller) => controller.kickPlayer(userId)),
    );

    socket.on(
      ClientToServerEventName.LeaveGame,
      withController((_event, controller) => {
        controller.leaveGame();
        gameController = undefined;
      }),
    );

    socket.on(
      ClientToServerEventName.SetStatus,
      withController(({ status }, controller) => controller.setStatus(status)),
    );

    socket.on(
      ClientToServerEventName.Split,
      withController((_event, controller) => controller.split()),
    );

    socket.on(
      ClientToServerEventName.Peel,
      withController((_event, controller) => controller.peel()),
    );

    socket.on(
      ClientToServerEventName.Dump,
      withController(({ tileId, boardLocation }, controller) =>
        controller.dump(tileId, boardLocation),
      ),
    );

    socket.on(
      ClientToServerEventName.MoveTilesFromHandToBoard,
      withController(({ tiles }, controller) =>
        controller.moveTilesFromHandToBoard(tiles),
      ),
    );

    socket.on(
      ClientToServerEventName.MoveTilesFromBoardToHand,
      withController(({ boardLocations }, controller) =>
        controller.moveTilesFromBoardToHand(boardLocations),
      ),
    );

    socket.on(
      ClientToServerEventName.MoveTilesOnBoard,
      withController(({ locations }, controller) =>
        controller.moveTilesOnBoard(locations),
      ),
    );

    socket.on(
      ClientToServerEventName.ShuffleHand,
      withController((_event, controller) => controller.shuffleHand()),
    );

    socket.on("disconnect", () => {
      gameController?.leaveGame();
      gameController = undefined;
      console.log(`${userId} disconnected`);
    });
  });
}
