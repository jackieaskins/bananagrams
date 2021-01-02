import Dictionary from './dictionary/Dictionary';
import {
  BoardSquares,
  BoardPosition,
  Direction,
  BoardSquare,
  ValidationStatus,
  getSquareId,
} from './models/Board';
import Tile from './models/Tile';

type ValidatePosition = {
  start: BoardPosition;
  direction: Direction;
};
type BoardBoundaries = {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
};

const getDelta = (direction: Direction): BoardPosition => {
  switch (direction) {
    case Direction.DOWN:
      return { row: 1, col: 0 };
    case Direction.ACROSS:
      return { row: 0, col: 1 };
  }
};

const getBoardBoundaries = (
  board: BoardSquares,
  { row, col }: BoardPosition
): BoardBoundaries => {
  let rowStart = row;
  let rowEnd = row;
  let colStart = col;
  let colEnd = col;

  Object.keys(board).forEach((id) => {
    const [r, c] = id.split(',');

    const row = parseInt(r);
    const col = parseInt(c);

    if (row < rowStart) rowStart = row;
    if (row > rowEnd) rowEnd = row;
    if (col < colStart) colStart = col;
    if (col > colEnd) colEnd = col;
  });

  return {
    rowStart,
    rowEnd,
    colStart,
    colEnd,
  };
};

const iterateWordFromStart = (
  board: BoardSquares,
  boardBoundaries: BoardBoundaries,
  start: BoardPosition,
  direction: Direction,
  loopFn: (square: BoardSquare) => boolean | void
): void => {
  const { rowEnd, colEnd } = boardBoundaries;
  const { row: rowDelta, col: colDelta } = getDelta(direction);
  let { row: nextRow, col: nextCol } = start;

  while (nextRow <= rowEnd && nextCol <= colEnd) {
    const square = board[getSquareId({ row: nextRow, col: nextCol })];
    if (!square || loopFn(square)) break;

    nextRow += rowDelta;
    nextCol += colDelta;
  }
};

const validateWordsAtPositions = (
  board: BoardSquares,
  boardBoundaries: BoardBoundaries,
  positionsToValidate: ValidatePosition[]
): void => {
  const positionsWithWords = positionsToValidate.map(({ start, direction }) => {
    const word: string[] = [];

    iterateWordFromStart(board, boardBoundaries, start, direction, (square) => {
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

    iterateWordFromStart(board, boardBoundaries, start, direction, (square) => {
      square.wordInfo[direction].validation = validationStatus;
    });
  });
};

export const validateAddTile = (
  board: BoardSquares,
  position: BoardPosition,
  tile: Tile
): BoardSquares => {
  const boardBoundaries = getBoardBoundaries(board, position);

  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction]
  );
  const { row, col } = position;

  const positionsToValidate: ValidatePosition[] = [];

  directions.forEach((direction) => {
    const { row: rowDelta, col: colDelta } = getDelta(direction);

    const beforeSquare =
      board[getSquareId({ row: row - rowDelta, col: col - colDelta })];
    const afterSquare =
      board[getSquareId({ row: row + rowDelta, col: col + colDelta })];

    const start = !!beforeSquare
      ? beforeSquare.wordInfo[direction].start
      : position;

    if (!!afterSquare) {
      iterateWordFromStart(
        board,
        boardBoundaries,
        { row: row + rowDelta, col: col + colDelta },
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

  board[getSquareId({ row, col })] = {
    tile,
    wordInfo: Object.fromEntries(wordInfo),
  };

  validateWordsAtPositions(board, boardBoundaries, positionsToValidate);

  return board;
};

export const validateRemoveTile = (
  board: BoardSquares,
  position: BoardPosition
): BoardSquares => {
  const boardBoundaries = getBoardBoundaries(board, position);

  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction]
  );
  const { row, col } = position;

  const positionsToValidate: ValidatePosition[] = [];
  directions.forEach((direction) => {
    const { row: rowDelta, col: colDelta } = getDelta(direction);

    const beforeSquare =
      board[getSquareId({ row: row - rowDelta, col: col - colDelta })];
    const afterSquare =
      board[getSquareId({ row: row + rowDelta, col: col + colDelta })];

    if (!!beforeSquare) {
      positionsToValidate.push({
        start: beforeSquare.wordInfo[direction].start,
        direction,
      });
    }

    if (!!afterSquare) {
      const newStart = { row: row + rowDelta, col: col + colDelta };
      iterateWordFromStart(
        board,
        boardBoundaries,
        newStart,
        direction,
        (square) => {
          square.wordInfo[direction].start = newStart;
        }
      );

      positionsToValidate.push({ start: newStart, direction });
    }
  });

  board[getSquareId({ row, col })] = null;

  validateWordsAtPositions(board, boardBoundaries, positionsToValidate);

  return board;
};
