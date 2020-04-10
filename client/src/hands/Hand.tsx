import React from 'react';
import Box from '@material-ui/core/Box';
import { useDrop } from 'react-dnd';

import { Hand as HandType } from './types';
import { useSocket } from '../SocketContext';
import Tile from '../tiles/Tile';
import { TileItem } from '../tiles/types';

type HandProps = {
  hand: HandType;
};

const Hand: React.FC<HandProps> = ({ hand }) => {
  const { socket } = useSocket();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: ({ boardPosition }: TileItem, monitor) =>
      monitor.isOver() && !!boardPosition,
    drop: ({ boardPosition }: TileItem) => {
      socket.emit('moveTileFromBoardToHand', { boardPosition });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      border={1}
      ref={dropRef}
      style={{
        backgroundColor: isOver && canDrop ? 'green' : 'transparent',
        marginTop: '10px',
        minHeight: '35px',
        opacity: isOver && canDrop ? 0.5 : 1,
        width: '525px',
      }}
    >
      {Object.values(hand).map((tile) => (
        <Tile key={tile.id} tile={tile} boardPosition={null} />
      ))}
    </Box>
  );
};

export default Hand;
