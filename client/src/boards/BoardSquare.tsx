/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Box } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { useStyles } from '../styles';
import { useSocket } from '../SocketContext';
import { TileItem } from '../tiles/types';
import Tile from '../tiles/Tile';
import { BoardSquare, Direction, WordInfo, ValidationStatus } from './types';

type BoardSquareProps = {
  boardSquare: BoardSquare | null;
  x: number;
  y: number;
};

type CheckValidation = (wordInfo: WordInfo) => boolean;

const getColor = (
  wordInfo: Record<Direction, WordInfo> | undefined
): string | undefined => {
  if (!wordInfo) return 'black';

  const isValid: CheckValidation = ({ validation }) =>
    validation === ValidationStatus.VALID;
  const isInvalid: CheckValidation = ({ validation }) =>
    validation === ValidationStatus.INVALID;
  const isValidated: CheckValidation = ({ validation }) =>
    validation !== ValidationStatus.NOT_VALIDATED;

  const validations = Object.values(wordInfo).filter(isValidated);

  if (validations.length === 0) return 'black';

  if (validations.every(isValid)) return 'green';
  if (validations.every(isInvalid)) return 'red';
  if (validations.some(isValid) && validations.some(isInvalid))
    return 'darkorange';

  return 'green';
};

const BoardSquare: React.FC<BoardSquareProps> = ({ boardSquare, x, y }) => {
  const classes = useStyles();
  const { socket } = useSocket();
  const { tile, wordInfo } = boardSquare ?? {};

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: (_, monitor) => monitor.isOver() && !tile,
    drop: ({ id, boardPosition }: TileItem) => {
      if (!!boardPosition) {
        socket.emit('moveTileOnBoard', {
          fromPosition: boardPosition,
          toPosition: { x, y },
        });
      } else {
        socket.emit('moveTileFromHandToBoard', {
          tileId: id,
          boardPosition: { x, y },
        });
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
      {tile ? (
        <Tile tile={tile} color={getColor(wordInfo)} boardPosition={{ x, y }} />
      ) : (
        ''
      )}
    </Box>
  );
};

export default BoardSquare;
