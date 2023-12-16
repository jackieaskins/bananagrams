import { BoardLocation } from "./board";
import { Game } from "./game";
import { PlayerStatus } from "./player";

export enum ClientToServerEventName {
  CreateGame = "createGame",
  JoinGame = "joinGame",
  KickPlayer = "kickPlayer",
  LeaveGame = "leaveGame",
  SetStatus = "setStatus",
  Split = "split",
  Peel = "peel",
  Dump = "dump",
  MoveTileFromHandToBoard = "moveTileFromHandToBoard",
  MoveTileFromBoardToHand = "moveTileFromBoardToHand",
  MoveTileOnBoard = "moveTileOnBoard",
  ShuffleHand = "shuffleHand",
}

export enum ServerToClientEventName {
  Notification = "notification",
  GameInfo = "gameInfo",
}

export type SocketCallback<T> = (
  error: { message: string } | null,
  args: T | null,
) => void;

export type SocketEventHandler<Event = null, CallbackArg = void> = (
  event: Event,
  callback?: SocketCallback<CallbackArg>,
) => void;

export type ClientToServerEvents = {
  [ClientToServerEventName.CreateGame]: SocketEventHandler<
    { gameName: string; username: string; isShortenedGame: boolean },
    Game
  >;
  [ClientToServerEventName.JoinGame]: SocketEventHandler<
    { gameId: string; username: string; isSpectator: boolean },
    Game
  >;
  [ClientToServerEventName.LeaveGame]: SocketEventHandler;

  [ClientToServerEventName.KickPlayer]: SocketEventHandler<{ userId: string }>;
  [ClientToServerEventName.SetStatus]: SocketEventHandler<{
    status: PlayerStatus;
  }>;

  [ClientToServerEventName.Split]: SocketEventHandler;
  [ClientToServerEventName.Peel]: SocketEventHandler;
  [ClientToServerEventName.Dump]: SocketEventHandler<{
    tileId: string;
    boardLocation: BoardLocation | null;
  }>;

  [ClientToServerEventName.ShuffleHand]: SocketEventHandler;

  [ClientToServerEventName.MoveTileFromHandToBoard]: SocketEventHandler<{
    tileId: string;
    boardLocation: BoardLocation;
  }>;
  [ClientToServerEventName.MoveTileFromBoardToHand]: SocketEventHandler<{
    boardLocation: BoardLocation;
  }>;
  [ClientToServerEventName.MoveTileOnBoard]: SocketEventHandler<{
    fromLocation: BoardLocation;
    toLocation: BoardLocation;
  }>;
};

export type ServerToClientEvents = {
  [ServerToClientEventName.Notification]: SocketEventHandler<{
    message: string;
  }>;
  [ServerToClientEventName.GameInfo]: SocketEventHandler<Game>;
};
