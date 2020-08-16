/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Box } from '@material-ui/core';
import { useDrop } from 'react-dnd';

import { useGame } from '../games/GameContext';
import { useStyles } from '../styles';
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
  wordInfo: Record<Direction, WordInfo>
): string | undefined => {
  const isValid: CheckValidation = ({ validation }) =>
    validation === ValidationStatus.VALID;
  const isValidated: CheckValidation = ({ validation }) =>
    validation !== ValidationStatus.NOT_VALIDATED;

  const validations = Object.values(wordInfo).filter(isValidated);

  if (validations.length === 0) return 'black';
  if (validations.every(isValid)) return 'green';
  return 'red';
};

const BoardSquare: React.FC<BoardSquareProps> = ({ boardSquare, x, y }) => {
  const classes = useStyles();
  const { handleMoveTileFromHandToBoard, handleMoveTileOnBoard } = useGame();
  const { tile, wordInfo } = boardSquare ?? {};

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'TILE',
    canDrop: (_, monitor) => monitor.isOver() && !tile,
    drop: ({ id, boardLocation }: TileItem) => {
      if (!!boardLocation) {
        handleMoveTileOnBoard(boardLocation, { x, y });
      } else {
        handleMoveTileFromHandToBoard(id, { x, y });
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
      {tile && wordInfo ? (
        <Tile tile={tile} color={getColor(wordInfo)} boardLocation={{ x, y }} />
      ) : (
        ''
      )}
    </Box>
  );
};

export default BoardSquare;
