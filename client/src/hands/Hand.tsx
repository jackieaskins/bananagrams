import React from 'react';
import { Box } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { Hand as HandType } from './types';
import { useSocket } from '../SocketContext';
import Tile from '../tiles/Tile';
import { TileItem } from '../tiles/types';
import { useStyles } from '../styles';
import TransparentPaper from '../paper/TransparentPaper';
import { useGame } from '../games/GameContext';

type HandProps = {
  hand: HandType;
};

const DEFAULT_BOARD_LENGTH = 21;

const Hand: React.FC<HandProps> = ({ hand }) => {
  const classes = useStyles();
  const { socket } = useSocket();
  const {
    gameInfo: { players },
  } = useGame();
  const boardLength =
    players.find((player) => player.userId === socket.id)?.board?.length ??
    DEFAULT_BOARD_LENGTH;

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
    <TransparentPaper>
      <Box
        // @ts-ignore
        ref={dropRef}
        display="flex"
        flexWrap="wrap"
        flexDirection="column"
        width={`${Math.max(Math.ceil(tiles.length / 14), 1) * 35}px`}
        height={`${25 * boardLength + 2 - 16}px`}
        p={1}
        className={isOver && canDrop ? classes.validDrop : ''}
      >
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} boardPosition={null} />
        ))}
      </Box>
    </TransparentPaper>
  );
};

export default Hand;
