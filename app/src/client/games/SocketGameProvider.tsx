import { useEffect, useState } from "react";
import {
  Location,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BoardLocation } from "../../types/board";
import { Game } from "../../types/game";
import {
  ClientToServerEventName,
  ServerToClientEventName,
} from "../../types/socket";
import { socket } from "../socket";
import { GameContext, getEmptyGameInfo } from "./GameContext";
import { GameLocationState } from "./types";

type GameParams = {
  gameId: string;
};

export default function SocketGameProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const navigate = useNavigate();
  const { pathname, state } = useLocation() as Location<GameLocationState>;
  const { gameId } = useParams<GameParams>() as GameParams;

  const [gameInfo, setGameInfo] = useState<Game>(
    state?.gameInfo ?? getEmptyGameInfo(gameId),
  );
  const [isInGame] = useState<boolean>(state?.isInGame ?? false);

  useEffect(() => {
    if (!isInGame) return;

    navigate(pathname, { replace: true });

    return (): void => {
      socket.emit(ClientToServerEventName.LeaveGame, null);
    };
  }, [gameId, isInGame, navigate, pathname]);

  useEffect(() => {
    socket.on(ServerToClientEventName.GameInfo, (gameInfo: Game) => {
      setGameInfo(gameInfo);
    });

    return (): void => {
      socket.off(ServerToClientEventName.GameInfo);
    };
  }, []);

  const handleDump = ({
    boardLocation,
    id,
  }: {
    boardLocation: BoardLocation | null;
    id: string;
  }): void => {
    socket.emit(ClientToServerEventName.Dump, { boardLocation, tileId: id });
  };
  const handleMoveTileFromBoardToHand = (
    boardLocation: BoardLocation,
  ): void => {
    socket.emit(ClientToServerEventName.MoveTileFromBoardToHand, {
      boardLocation,
    });
  };
  const handleMoveTileFromHandToBoard = (
    tileId: string,
    boardLocation: BoardLocation,
  ): void => {
    socket.emit(ClientToServerEventName.MoveTileFromHandToBoard, {
      tileId,
      boardLocation,
    });
  };
  const handleMoveTileOnBoard = (
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ): void => {
    socket.emit(ClientToServerEventName.MoveTileOnBoard, {
      fromLocation,
      toLocation,
    });
  };
  const handlePeel = (): void => {
    socket.emit(ClientToServerEventName.Peel, null);
  };
  return (
    <GameContext.Provider
      value={{
        gameInfo,
        handleDump,
        handleMoveTileFromBoardToHand,
        handleMoveTileFromHandToBoard,
        handleMoveTileOnBoard,
        handlePeel,
        isInGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
