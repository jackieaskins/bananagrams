import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { GameInfo, GameLocationState } from './types';
import { useSocket } from '../socket/SocketContext';
import { getEmptyGameInfo, GameProvider } from './GameContext';
import { BoardLocation } from '../boards/types';
import { TileItem } from '../tiles/types';

type GameParams = {
  gameId: string;
};

const SocketGameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocket();
  const { replace } = useHistory();
  const { pathname, state } = useLocation<GameLocationState>();
  const { gameId } = useParams<GameParams>();

  const [gameInfo, setGameInfo] = useState<GameInfo>(
    state?.gameInfo ?? getEmptyGameInfo(gameId)
  );
  const [isInGame] = useState<boolean>(state?.isInGame ?? false);

  const handleDump = ({ boardLocation, id }: TileItem): void => {
    socket.emit('dump', { boardLocation, tileId: id });
  };
  const handleMoveTileFromBoardToHand = (
    boardLocation: BoardLocation | null
  ): void => {
    socket.emit('moveTileFromBoardToHand', { boardLocation });
  };
  const handleMoveTileFromHandToBoard = (
    tileId: string,
    boardLocation: BoardLocation
  ): void => {
    socket.emit('moveTileFromHandToBoard', { tileId, boardLocation });
  };
  const handleMoveAllTilesFromBoardToHand = (): void => {
    socket.emit('moveAllTilesFromBoardToHand', {});
  };
  const handleMoveTileOnBoard = (
    fromLocation: BoardLocation,
    toLocation: BoardLocation
  ): void => {
    socket.emit('moveTileOnBoard', { fromLocation, toLocation });
  };
  const handlePeel = (): void => {
    socket.emit('peel', {});
  };

  useEffect(() => {
    if (isInGame) {
      replace(pathname);

      return (): void => {
        socket.emit('leaveGame', { gameId });
      };
    }

    return;
  }, [gameId, isInGame, pathname, replace, socket]);

  useEffect(() => {
    socket.on('gameInfo', (gameInfo: GameInfo) => {
      setGameInfo(gameInfo);
    });

    return (): void => {
      socket.off('gameInfo');
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
        walkthroughEnabled: false,
      }}
    >
      {children}
    </GameProvider>
  );
};

export default SocketGameProvider;
