import React from 'react';
import { useDrop } from 'react-dnd';

import { useSocket } from '../SocketContext';
import { Tile as TileType, TileItem } from '../tiles/types';
import Tile from '../tiles/Tile';

type BoardSquareProps = {
  tile: TileType | null;
  x: number;
  y: number;
};

const BoardSquare: React.FC<BoardSquareProps> = ({ tile, x, y }) => {
  const { socket } = useSocket();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: (_, monitor) => monitor.isOver() && !tile,
    drop: ({ id, boardPosition }: TileItem) => {
      if (!!boardPosition) {
        socket.emit('moveTileOnBoard', {
          fromPosition: boardPosition,
          toPosition: { x, y },
        });
      } else {
        socket.emit('moveTileFromHandToBoard', {
          tileId: id,
          boardPosition: { x, y },
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      style={{
        backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'transparent',
        opacity: isOver ? 0.5 : 1,
        height: '25px',
        width: '25px',
      }}
      ref={dropRef}
    >
      {tile ? <Tile tile={tile} boardPosition={{ x, y }} /> : ''}
    </div>
  );
};

export default BoardSquare;
