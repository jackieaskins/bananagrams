/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { useGame } from '../games/GameContext';
import { useStyles } from '../styles';
import Tile from '../tiles/Tile';
import { TileItem } from '../tiles/types';
import { BoardSquare as BoardSquareType, ValidationStatus } from './types';

type BoardSquareProps = {
  boardSquare: BoardSquareType | null;
  row: number;
  col: number;
};

const getColor = (validationStatus: ValidationStatus): string | undefined => {
  if (validationStatus === ValidationStatus.NOT_VALIDATED) return 'black';
  if (validationStatus === ValidationStatus.VALID) return 'green';
  return 'red';
};

const BoardSquare = ({
  boardSquare,
  row,
  col,
}: BoardSquareProps): JSX.Element => {
  const classes = useStyles();
  const { handleMoveTileFromHandToBoard, handleMoveTileOnBoard } = useGame();
  const { tile, validationStatus } = boardSquare ?? {};

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: (_, monitor) => monitor.isOver() && !tile,
    drop: ({ id, boardPosition }: TileItem) => {
      if (!!boardPosition) {
        handleMoveTileOnBoard(boardPosition, { row, col });
      } else {
        handleMoveTileFromHandToBoard(id, { row, col });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      className={isOver && canDrop ? classes.validDrop : ''}
      height="25px"
      width="25px"
      // @ts-ignore
      ref={dropRef}
    >
      {tile && validationStatus ? (
        <Tile
          tile={tile}
          color={getColor(validationStatus)}
          boardPosition={{ row, col }}
        />
      ) : (
        ''
      )}
    </Box>
  );
};

export default BoardSquare;
