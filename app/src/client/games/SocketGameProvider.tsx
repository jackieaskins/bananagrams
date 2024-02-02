import { useCallback, useEffect, useState } from "react";
import {
  Location,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { GameContext, getEmptyGameInfo } from "./GameContext";
import { GameLocationState } from "./types";
import { socket } from "@/client/socket";
import { BoardLocation } from "@/types/board";
import { Game } from "@/types/game";
import { PlayerStatus } from "@/types/player";
import {
  ClientToServerEventName,
  ServerToClientEventName,
} from "@/types/socket";

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

    return () => {
      socket.emit(ClientToServerEventName.LeaveGame, null);
    };
  }, [gameId, isInGame, navigate, pathname]);

  useEffect(() => {
    socket.on(ServerToClientEventName.GameInfo, (gameInfo: Game) => {
      setGameInfo(gameInfo);
    });

    return () => {
      socket.off(ServerToClientEventName.GameInfo);
    };
  }, []);

  const handleDump = useCallback(
    (
      tiles: Array<{
        boardLocation: BoardLocation | null;
        tileId: string;
      }>,
    ) => {
      socket.emit(ClientToServerEventName.Dump, { tiles });
    },
    [],
  );

  const handleMoveTilesFromBoardToHand = useCallback(
    (boardLocations: BoardLocation[]) => {
      socket.emit(ClientToServerEventName.MoveTilesFromBoardToHand, {
        boardLocations,
      });
    },
    [],
  );

  const handleMoveTilesFromHandToBoard = useCallback(
    (tiles: Array<{ tileId: string; boardLocation: BoardLocation }>) => {
      socket.emit(ClientToServerEventName.MoveTilesFromHandToBoard, { tiles });
    },
    [],
  );

  const handleMoveTilesOnBoard = useCallback(
    (
      locations: Array<{
        fromLocation: BoardLocation;
        toLocation: BoardLocation;
      }>,
    ) => {
      socket.emit(ClientToServerEventName.MoveTilesOnBoard, { locations });
    },
    [],
  );

  const handlePeel = useCallback(() => {
    socket.emit(ClientToServerEventName.Peel, null);
  }, []);

  const handleShuffleHand = useCallback(() => {
    socket.emit(ClientToServerEventName.ShuffleHand, null);
  }, []);

  const handleSpectate = useCallback(() => {
    socket.emit(ClientToServerEventName.SetStatus, {
      status: PlayerStatus.SPECTATING,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameInfo,
        handleDump,
        handleMoveTilesFromBoardToHand,
        handleMoveTilesFromHandToBoard,
        handleMoveTilesOnBoard,
        handlePeel,
        handleShuffleHand,
        handleSpectate,
        isInGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
