import React from 'react';
import Box from '@material-ui/core/Box';

import { useSocket } from '../SocketContext';
import { useDrop } from 'react-dnd';
import { TileItem } from '../tiles/types';
import { BsTrash } from 'react-icons/bs';
import { useGame } from '../games/GameContext';

type DumpProps = {};

const Dump: React.FC<DumpProps> = () => {
  const { socket } = useSocket();
  const {
    gameInfo: { bunchSize },
  } = useGame();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: (_, monitor) => monitor.isOver() && bunchSize >= 3,
    drop: ({ boardPosition, id }: TileItem) => {
      socket.emit('dump', { boardPosition, tileId: id });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      ref={dropRef}
      border={1}
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'transparent',
        opacity: isOver ? 0.5 : 1,
      }}
    >
      Dump!
      {<BsTrash />}
    </Box>
  );
};

export default Dump;
