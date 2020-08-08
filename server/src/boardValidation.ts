import {
  BoardSquares,
  BoardLocation,
  Direction,
  BoardSquare,
  ValidationStatus,
} from './models/Board';
import Tile from './models/Tile';
import Dictionary from './dictionary/Dictionary';

type ValidateLocation = {
  start: BoardLocation;
  direction: Direction;
};

const getDelta = (direction: Direction): BoardLocation => {
  switch (direction) {
    case Direction.DOWN:
      return { x: 1, y: 0 };
    case Direction.ACROSS:
      return { x: 0, y: 1 };
  }
};

const iterateWordFromStart = (
  board: BoardSquares,
  start: BoardLocation,
  direction: Direction,
  loopFn: (square: BoardSquare) => boolean | void
): void => {
  const delta = getDelta(direction);
  let { x: nextX, y: nextY } = start;

  while (nextX < board.length && nextY < board[nextX].length) {
    const square = board[nextX]?.[nextY];
    if (!square || loopFn(square)) break;

    nextX += delta.x;
    nextY += delta.y;
  }
};

const validateWordsAtLocations = (
  board: BoardSquares,
  locationsToValidate: ValidateLocation[]
): void => {
  const locationsWithWords = locationsToValidate.map(({ start, direction }) => {
    const word: string[] = [];

    iterateWordFromStart(board, start, direction, (square) => {
      word.push(square.tile.getLetter());
    });

    return { start, direction, word: word.join('') };
  });

  locationsWithWords.forEach(({ start, direction, word }) => {
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
  location: BoardLocation,
  tile: Tile
): BoardSquares => {
  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction]
  );
  const { x, y } = location;

  const locationsToValidate: ValidateLocation[] = [];

  directions.forEach((direction) => {
    const delta = getDelta(direction);

    const beforeSquare = board[x - delta.x]?.[y - delta.y];
    const afterSquare = board[x + delta.x]?.[y + delta.y];

    const start = !!beforeSquare
      ? beforeSquare.wordInfo[direction].start
      : location;

    if (!!afterSquare) {
      iterateWordFromStart(
        board,
        { x: x + delta.x, y: y + delta.y },
        direction,
        (square) => {
          square.wordInfo[direction].start = start;
        }
      );
    }

    locationsToValidate.push({ start, direction });
  });

  const wordInfo = locationsToValidate.map(({ direction, start }) => [
    direction,
    { start, validation: ValidationStatus.NOT_VALIDATED },
  ]);

  board[x][y] = { tile, wordInfo: Object.fromEntries(wordInfo) };

  validateWordsAtLocations(board, locationsToValidate);

  return board;
};

export const validateRemoveTile = (
  board: BoardSquares,
  location: BoardLocation
): BoardSquares => {
  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction]
  );
  const { x, y } = location;

  const locationsToValidate: ValidateLocation[] = [];
  directions.forEach((direction) => {
    const delta = getDelta(direction);

    const beforeSquare = board[x - delta.x]?.[y - delta.y];
    const afterSquare = board[x + delta.x]?.[y + delta.y];

    if (!!beforeSquare) {
      locationsToValidate.push({
        start: beforeSquare.wordInfo[direction].start,
        direction,
      });
    }

    if (!!afterSquare) {
      const newStart = { x: x + delta.x, y: y + delta.y };
      iterateWordFromStart(board, newStart, direction, (square) => {
        square.wordInfo[direction].start = newStart;
      });

      locationsToValidate.push({ start: newStart, direction });
    }
  });

  board[x][y] = null;

  validateWordsAtLocations(board, locationsToValidate);

  return board;
};
