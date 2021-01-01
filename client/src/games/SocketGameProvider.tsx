import { ReactNode, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { BoardPosition } from '../boards/types';
import { useSocket } from '../socket/SocketContext';
import { TileItem } from '../tiles/types';
import { getEmptyGameInfo, GameProvider } from './GameContext';
import { GameInfo, GameLocationState } from './types';

type GameParams = {
  gameId: string;
};

const SocketGameProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { socket } = useSocket();
  const { replace } = useHistory();
  const { pathname, state } = useLocation<GameLocationState>();
  const { gameId } = useParams<GameParams>();

  const [gameInfo, setGameInfo] = useState<GameInfo>(
    state?.gameInfo ?? getEmptyGameInfo(gameId)
  );
  const [isInGame] = useState<boolean>(state?.isInGame ?? false);

  const handleDump = ({ boardPosition, id }: TileItem): void => {
    socket.emit('dump', { boardPosition, tileId: id });
  };
  const handleMoveTileFromBoardToHand = (
    boardPosition: BoardPosition | null
  ): void => {
    socket.emit('moveTileFromBoardToHand', { boardPosition });
  };
  const handleMoveTileFromHandToBoard = (
    tileId: string,
    boardPosition: BoardPosition
  ): void => {
    socket.emit('moveTileFromHandToBoard', { tileId, boardPosition });
  };
  const handleMoveAllTilesFromBoardToHand = (): void => {
    socket.emit('moveAllTilesFromBoardToHand', {});
  };
  const handleMoveTileOnBoard = (
    fromPosition: BoardPosition,
    toPosition: BoardPosition
  ): void => {
    socket.emit('moveTileOnBoard', { fromPosition, toPosition });
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
  }, []);

  useEffect(() => {
    socket.on('gameInfo', (gameInfo: GameInfo) => {
      setGameInfo(gameInfo);
    });

    return (): void => {
      socket.off('gameInfo');
    };
  }, []);

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
