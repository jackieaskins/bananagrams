import React from 'react';
import { Box } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { useStyles } from '../styles';
import { useSocket } from '../SocketContext';
import { Tile as TileType, TileItem } from '../tiles/types';
import Tile from '../tiles/Tile';

type BoardSquareProps = {
  tile: TileType | null;
  x: number;
  y: number;
};

const BoardSquare: React.FC<BoardSquareProps> = ({ tile, x, y }) => {
  const classes = useStyles();
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
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      className={
        isOver ? (canDrop ? classes.validDrop : classes.invalidDrop) : ''
      }
      height="25px"
      width="25px"
      // @ts-ignore
      ref={dropRef}
    >
      {tile ? <Tile tile={tile} boardPosition={{ x, y }} /> : ''}
    </Box>
  );
};

export default BoardSquare;
