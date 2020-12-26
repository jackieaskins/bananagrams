/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Typography, Box } from '@material-ui/core';
import { useDrag } from 'react-dnd';

import { Tile as TileType } from './types';

type TileProps = {
  boardLocation: { x: number; y: number } | null;
  tile: TileType;
  color?: string;
};

const Tile = ({
  boardLocation,
  tile: { id, letter },
  color = 'black',
}: TileProps): JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'TILE', id, boardLocation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const margin = !!boardLocation ? '0' : '5px';

  return (
    <Box
      // @ts-ignore
      ref={dragRef}
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      border={1}
      borderRadius="borderRadius"
      style={{
        color: color,
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
  );
};

export default Tile;
