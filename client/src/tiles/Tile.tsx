/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Typography, Box } from '@material-ui/core';
import { useDrag } from 'react-dnd';

import { Tile as TileType } from './types';

type TileProps = {
  boardPosition: { row: number; col: number } | null;
  tile: TileType;
  color?: string;
};

const Tile = ({
  boardPosition,
  tile: { id, letter },
  color = 'black',
}: TileProps): JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'TILE', id, boardPosition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const margin = !!boardPosition ? '0' : '5px';

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
        color,
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
