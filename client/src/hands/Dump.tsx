/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Typography } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { useGame } from '../games/GameContext';
import TransparentPaper from '../paper/TransparentPaper';
import { useStyles } from '../styles';
import { TileItem } from '../tiles/types';

const EXCHANGE_COUNT = 3;

const Dump = (): JSX.Element => {
  const classes = useStyles();
  const {
    gameInfo: { bunch },
    handleDump,
  } = useGame();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: () => bunch.length >= EXCHANGE_COUNT,
    drop: (tileItem: TileItem) => {
      handleDump(tileItem);
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
        {bunch.length >= EXCHANGE_COUNT && (
          <Typography variant="caption" color="textSecondary">
            Drag a tile here to exchange it for {EXCHANGE_COUNT} from the bunch
          </Typography>
        )}
      </Box>
    </TransparentPaper>
  );
};

export default Dump;
