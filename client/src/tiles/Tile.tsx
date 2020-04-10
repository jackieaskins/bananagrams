import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useDrag } from 'react-dnd';

import { Tile as TileType } from './types';

type TileProps = {
  boardPosition: { x: number; y: number } | null;
  tile: TileType;
};

const Tile: React.FC<TileProps> = ({ boardPosition, tile: { id, letter } }) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'TILE', id, boardPosition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const margin = !!boardPosition ? '0' : '5px';

  return (
    <div ref={dragRef}>
      <Box
        display="inline-flex"
        justifyContent="center"
        alignItems="center"
        border={1}
        borderRadius="borderRadius"
        style={{
          backgroundColor: '#ffffc7',
          cursor: 'move',
          height: '23px',
          margin,
          opacity: isDragging ? 0.5 : 1,
          width: '23px',
        }}
      >
        <Typography variant="body2">{letter}</Typography>
      </Box>
    </div>
  );
};

export default Tile;
