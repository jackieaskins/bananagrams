import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { Hand as HandType } from './types';
import { useSocket } from '../SocketContext';
import Tile from '../tiles/Tile';
import Dump from './Dump';
import { TileItem } from '../tiles/types';
import { useStyles } from '../styles';
import TransparentPaper from '../paper/TransparentPaper';

type HandProps = {
  hand: HandType;
};

const Hand: React.FC<HandProps> = ({ hand }) => {
  const classes = useStyles();
  const { socket } = useSocket();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: ({ boardPosition }: TileItem, monitor) =>
      monitor.isOver() && !!boardPosition,
    drop: ({ boardPosition }: TileItem) => {
      socket.emit('moveTileFromBoardToHand', { boardPosition });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const tiles = Object.values(hand);

  return (
    <TransparentPaper
      variant="outlined"
      style={{ backgroundColor: 'transparent' }}
    >
      <Box
        // @ts-ignore
        ref={dropRef}
        display="flex"
        flexWrap="wrap"
        minHeight="35px"
        p={1}
        className={isOver && canDrop ? classes.validDrop : ''}
        alignItems={tiles.length == 0 && 'center'}
        justifyContent={tiles.length == 0 && 'center'}
      >
        {tiles.length > 0 ? (
          tiles.map((tile) => (
            <Tile key={tile.id} tile={tile} boardPosition={null} />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No tiles in hand
          </Typography>
        )}
      </Box>
      <Divider />
      <Dump />
    </TransparentPaper>
  );
};

export default Hand;
