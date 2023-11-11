/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Button, Divider, Tooltip } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { Hand as HandType } from './types';
import { useSocket } from '../socket/SocketContext';
import Tile from '../tiles/Tile';
import { TileItem } from '../tiles/types';
import { useStyles } from '../styles';
import TransparentPaper from '../paper/TransparentPaper';
import { useGame } from '../games/GameContext';
import { Shuffle } from '@material-ui/icons';

type HandProps = {
  hand: HandType;
};

const DEFAULT_BOARD_LENGTH = 21;

const Hand: React.FC<HandProps> = ({ hand }) => {
  const classes = useStyles();
  const { socket } = useSocket();
  const {
    gameInfo: { players },
    handleMoveTileFromBoardToHand,
  } = useGame();
  const boardLength =
    players.find((player) => player.userId === socket.id)?.board?.length ??
    DEFAULT_BOARD_LENGTH;

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: ({ boardLocation }: TileItem, monitor) =>
      monitor.isOver() && !!boardLocation,
    drop: ({ boardLocation }: TileItem) => {
      handleMoveTileFromBoardToHand(boardLocation);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <TransparentPaper>
      <Tooltip title="Shuffle hand">
        <Button
          style={{
            width: '100%',
          }}
          disabled={hand.length <= 1}
          size="small"
          onClick={(): void => {
            socket.emit('shuffleHand', {});
          }}
        >
          <Shuffle color="action" fontSize="small" />
        </Button>
      </Tooltip>

      <Divider />

      <Box
        // @ts-ignore
        ref={dropRef}
        display="flex"
        flexWrap="wrap"
        flexDirection="column"
        width={`${Math.max(Math.ceil(hand.length / 13), 2) * 35}px`}
        height={`${24 * boardLength + 2 - 26}px`}
        p={1}
        className={isOver && canDrop ? classes.validDrop : ''}
      >
        {hand.map((tile) => (
          <Tile key={tile.id} tile={tile} boardLocation={null} />
        ))}
      </Box>
    </TransparentPaper>
  );
};

export default Hand;
