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

  const margin = !!boardPosition ? 'm-0' : 'm-1';

  return (
    <div
      className={`d-flex justify-content-center align-items-center border border-dark rounded ${margin}`}
      ref={dragRef}
      style={{
        backgroundColor: '#ffffc7',
        cursor: 'move',
        height: '25px',
        opacity: isDragging ? 0.5 : 1,
        width: '25px',
      }}
    >
      {letter}
    </div>
  );
};

export default Tile;
