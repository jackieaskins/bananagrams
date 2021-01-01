import Dictionary from './dictionary/Dictionary';
import {
  BoardSquares,
  BoardPosition,
  Direction,
  BoardSquare,
  ValidationStatus,
} from './models/Board';
import Tile from './models/Tile';

type ValidatePosition = {
  start: BoardPosition;
  direction: Direction;
};

const getDelta = (direction: Direction): BoardPosition => {
  switch (direction) {
    case Direction.DOWN:
      return { row: 1, col: 0 };
    case Direction.ACROSS:
      return { row: 0, col: 1 };
  }
};

const iterateWordFromStart = (
  board: BoardSquares,
  start: BoardPosition,
  direction: Direction,
  loopFn: (square: BoardSquare) => boolean | void
): void => {
  const delta = getDelta(direction);
  let { row: nextRow, col: nextCol } = start;

  while (nextRow < board.length && nextCol < board[nextRow].length) {
    const square = board[nextRow][nextCol];
    if (!square || loopFn(square)) break;

    nextRow += delta.row;
    nextCol += delta.col;
  }
};

const validateWordsAtPositions = (
  board: BoardSquares,
  positionsToValidate: ValidatePosition[]
): void => {
  const positionsWithWords = positionsToValidate.map(({ start, direction }) => {
    const word: string[] = [];

    iterateWordFromStart(board, start, direction, (square) => {
      word.push(square.tile.getLetter());
    });

    return { start, direction, word: word.join('') };
  });

  positionsWithWords.forEach(({ start, direction, word }) => {
    let validationStatus: ValidationStatus;

    if (word.length === 1) {
      validationStatus = ValidationStatus.NOT_VALIDATED;
    } else {
      validationStatus = Dictionary.isWord(word.toLowerCase())
        ? ValidationStatus.VALID
        : ValidationStatus.INVALID;
    }

    iterateWordFromStart(board, start, direction, (square) => {
      square.wordInfo[direction].validation = validationStatus;
    });
  });
};

export const validateAddTile = (
  board: BoardSquares,
  position: BoardPosition,
  tile: Tile
): BoardSquares => {
  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction]
  );
  const { row, col } = position;

  const positionsToValidate: ValidatePosition[] = [];

  directions.forEach((direction) => {
    const delta = getDelta(direction);

    const beforeSquare = board[row - delta.row]?.[col - delta.col];
    const afterSquare = board[row + delta.row]?.[col + delta.col];

    const start = !!beforeSquare
      ? beforeSquare.wordInfo[direction].start
      : position;

    if (!!afterSquare) {
      iterateWordFromStart(
        board,
        { row: row + delta.row, col: col + delta.col },
        direction,
        (square) => {
          square.wordInfo[direction].start = start;
        }
      );
    }

    positionsToValidate.push({ start, direction });
  });

  const wordInfo = positionsToValidate.map(({ direction, start }) => [
    direction,
    { start, validation: ValidationStatus.NOT_VALIDATED },
  ]);

  board[row][col] = { tile, wordInfo: Object.fromEntries(wordInfo) };

  validateWordsAtPositions(board, positionsToValidate);

  return board;
};

export const validateRemoveTile = (
  board: BoardSquares,
  position: BoardPosition
): BoardSquares => {
  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction]
  );
  const { row, col } = position;

  const positionsToValidate: ValidatePosition[] = [];
  directions.forEach((direction) => {
    const delta = getDelta(direction);

    const beforeSquare = board[row - delta.row]?.[col - delta.col];
    const afterSquare = board[row + delta.row]?.[col + delta.col];

    if (!!beforeSquare) {
      positionsToValidate.push({
        start: beforeSquare.wordInfo[direction].start,
        direction,
      });
    }

    if (!!afterSquare) {
      const newStart = { row: row + delta.row, col: col + delta.col };
      iterateWordFromStart(board, newStart, direction, (square) => {
        square.wordInfo[direction].start = newStart;
      });

      positionsToValidate.push({ start: newStart, direction });
    }
  });

  board[row][col] = null;

  validateWordsAtPositions(board, positionsToValidate);

  return board;
};
