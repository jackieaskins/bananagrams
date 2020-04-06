import React from 'react';

import BoardSquare from './BoardSquare';
import { Board as BoardType } from '../boards/types';

type BoardProps = {
  board: BoardType;
};

const Board: React.FC<BoardProps> = ({ board }) => (
  <div className="d-inline-flex flex-column" style={{ border: '1px solid' }}>
    {board.map((row, x) => (
      <div key={x} className="d-flex">
        {row.map((tile, y) => (
          <BoardSquare key={y} x={x} y={y} tile={tile} />
        ))}
      </div>
    ))}
  </div>
);

export default Board;
