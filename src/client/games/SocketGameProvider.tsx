import { useEffect, useState } from "react";
import {
  Location,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BoardLocation } from "../../types/board";
import { Game } from "../../types/game";
import { useSocket } from "../socket/SocketContext";
import { TileItem } from "../tiles/types";
import { GameProvider, getEmptyGameInfo } from "./GameContext";
import { GameLocationState } from "./types";

type GameParams = {
  gameId: string;
};

export default function SocketGameProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { pathname, state } = useLocation() as Location<GameLocationState>;
  const { gameId } = useParams<GameParams>() as GameParams;

  const [gameInfo, setGameInfo] = useState<Game>(
    state?.gameInfo ?? getEmptyGameInfo(gameId),
  );
  const [isInGame] = useState<boolean>(state?.isInGame ?? false);

  const handleDump = ({ boardLocation, id }: TileItem): void => {
    socket.emit("dump", { boardLocation, tileId: id });
  };
  const handleMoveTileFromBoardToHand = (
    boardLocation: BoardLocation | null,
  ): void => {
    socket.emit("moveTileFromBoardToHand", { boardLocation });
  };
  const handleMoveTileFromHandToBoard = (
    tileId: string,
    boardLocation: BoardLocation,
  ): void => {
    socket.emit("moveTileFromHandToBoard", { tileId, boardLocation });
  };
  const handleMoveAllTilesFromBoardToHand = (): void => {
    socket.emit("moveAllTilesFromBoardToHand", {});
  };
  const handleMoveTileOnBoard = (
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ): void => {
    socket.emit("moveTileOnBoard", { fromLocation, toLocation });
  };
  const handlePeel = (): void => {
    socket.emit("peel", {});
  };

  useEffect(() => {
    if (isInGame) {
      navigate(pathname, { replace: true });

      return (): void => {
        socket.emit("leaveGame", { gameId });
      };
    }

    return;
  }, [gameId, isInGame, navigate, pathname, socket]);

  useEffect(() => {
    socket.on("gameInfo", (gameInfo: Game) => {
      setGameInfo(gameInfo);
    });

    return (): void => {
      socket.off("gameInfo");
    };
  }, [socket]);

  return (
    <GameProvider
      gameState={{
        gameInfo,
        handleDump,
        handleMoveTileFromBoardToHand,
        handleMoveTileFromHandToBoard,
        handleMoveAllTilesFromBoardToHand,
        handleMoveTileOnBoard,
        handlePeel,
        isInGame,
      }}
    >
      {children}
    </GameProvider>
  );
}
