import React from 'react';
import { Box, Typography } from '@material-ui/core';

import TransparentPaper from '../paper/TransparentPaper';
import { useSocket } from '../SocketContext';
import { useDrop } from 'react-dnd';
import { TileItem } from '../tiles/types';
import { useGame } from '../games/GameContext';
import { useStyles } from '../styles';

const EXCHANGE_COUNT = 3;

const Dump: React.FC<{}> = () => {
  const classes = useStyles();
  const { socket } = useSocket();
  const {
    gameInfo: { bunchSize },
  } = useGame();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: () => bunchSize >= EXCHANGE_COUNT,
    drop: ({ boardPosition, id }: TileItem) => {
      socket.emit('dump', { boardPosition, tileId: id });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <TransparentPaper style={{ width: '100%' }}>
      <Box
        // @ts-ignore
        ref={dropRef}
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        justifyContent="center"
        className={
          isOver ? (canDrop ? classes.validDrop : classes.invalidDrop) : ''
        }
      >
        <Typography variant="button" color="textSecondary">
          Dump!
        </Typography>
        {bunchSize > EXCHANGE_COUNT && (
          <Typography variant="caption" color="textSecondary">
            Drag a tile here to exchange it for {EXCHANGE_COUNT} from the bunch
          </Typography>
        )}
      </Box>
    </TransparentPaper>
  );
};

export default Dump;
