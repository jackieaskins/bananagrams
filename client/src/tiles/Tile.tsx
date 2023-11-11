import { Typography, Box } from '@mui/material';
import { useDrag } from 'react-dnd';

import { Tile as TileType } from './types';

type TileProps = {
  boardLocation: { x: number; y: number } | null;
  tile: TileType;
  color?: string;
};

const Tile: React.FC<TileProps> = ({
  boardLocation,
  tile: { id, letter },
  color = 'black',
}) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'TILE', id, boardLocation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const margin = !!boardLocation ? '0' : '5px';

  return (
    <Box
      ref={dragRef}
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      border={1}
      borderRadius={1}
      sx={{
        color: color,
        backgroundColor: '#ffffc7',
        cursor: 'move',
        height: '25px',
        margin,
        opacity: isDragging ? 0.5 : 1,
        width: '25px',
      }}
    >
      <Typography variant="body2">{letter}</Typography>
    </Box>
  );
};

export default Tile;
