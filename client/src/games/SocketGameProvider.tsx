import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  Location,
} from "react-router-dom";
import { BoardLocation } from "../boards/types";
import { useSocket } from "../socket/SocketContext";
import { TileItem } from "../tiles/types";
import { getEmptyGameInfo, GameProvider } from "./GameContext";
import { GameInfo, GameLocationState } from "./types";

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

  const [gameInfo, setGameInfo] = useState<GameInfo>(
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
    socket.on("gameInfo", (gameInfo: GameInfo) => {
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
