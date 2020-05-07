import React from 'react';
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
    <img
      ref={dragRef}
      style={{ cursor: 'move', margin, opacity: isDragging ? 0.5 : 1 }}
      src={`/assets/images/${letter}.png`}
      alt={`Tile with the letter ${letter}`}
      width="25px"
      height="25px"
    />
  );
};

export default Tile;
