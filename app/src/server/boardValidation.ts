import { generateBoardKey, parseBoardKey } from "./boardKey";
import Dictionary from "./dictionary/Dictionary";
import { BoardSquareModel, BoardSquareModels } from "./models/BoardModel";
import TileModel from "./models/TileModel";
import {
  BoardLocation,
  Direction,
  ValidationStatus,
  WordInfo,
} from "@/types/board";

type ValidateLocation = {
  start: BoardLocation;
  direction: Direction;
};

function getDelta(direction: Direction): BoardLocation {
  switch (direction) {
    case Direction.DOWN:
      return { x: 1, y: 0 };
    case Direction.ACROSS:
      return { x: 0, y: 1 };
  }
}

function iterateWordFromStart(
  board: BoardSquareModels,
  start: BoardLocation,
  direction: Direction,
  loopFn: (square: BoardSquareModel) => boolean | void,
): void {
  const delta = getDelta(direction);
  let { x: nextX, y: nextY } = start;

  const boardSquares = Object.keys(board).map(parseBoardKey);
  const maxX = Math.max(...boardSquares.map(({ x }) => x));
  const maxY = Math.max(...boardSquares.map(({ y }) => y));

  while (nextX <= maxX && nextY <= maxY) {
    const square = board[generateBoardKey({ x: nextX, y: nextY })];
    if (!square || loopFn(square)) break;

    nextX += delta.x;
    nextY += delta.y;
  }
}

function validateWordsAtLocations(
  board: BoardSquareModels,
  locationsToValidate: ValidateLocation[],
): void {
  const locationsWithWords = locationsToValidate.map(({ start, direction }) => {
    const word: string[] = [];

    iterateWordFromStart(board, start, direction, (square) => {
      word.push(square.tile.getLetter());
    });

    return { start, direction, word: word.join("") };
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
}

export function validateAddTile(
  board: BoardSquareModels,
  location: BoardLocation,
  tile: TileModel,
): BoardSquareModels {
  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction],
  );
  const { x, y } = location;

  const locationsToValidate: ValidateLocation[] = [];

  directions.forEach((direction) => {
    const delta = getDelta(direction);

    const beforeSquare =
      board[generateBoardKey({ x: x - delta.x, y: y - delta.y })];
    const afterSquare =
      board[generateBoardKey({ x: x + delta.x, y: y + delta.y })];

    const start = beforeSquare
      ? beforeSquare.wordInfo[direction].start
      : location;

    if (afterSquare) {
      iterateWordFromStart(
        board,
        { x: x + delta.x, y: y + delta.y },
        direction,
        (square) => {
          square.wordInfo[direction].start = start;
        },
      );
    }

    locationsToValidate.push({ start, direction });
  });

  const wordInfo = locationsToValidate.map(({ direction, start }) => [
    direction,
    { start, validation: ValidationStatus.NOT_VALIDATED },
  ]);

  board[generateBoardKey(location)] = {
    tile,
    wordInfo: Object.fromEntries(wordInfo) as Record<Direction, WordInfo>,
  };

  validateWordsAtLocations(board, locationsToValidate);

  return board;
}

export function validateRemoveTile(
  board: BoardSquareModels,
  location: BoardLocation,
): BoardSquareModels {
  const directions: Direction[] = Object.keys(Direction).map(
    (direction) => Direction[direction as keyof typeof Direction],
  );
  const { x, y } = location;

  const locationsToValidate: ValidateLocation[] = [];
  directions.forEach((direction) => {
    const delta = getDelta(direction);

    const beforeSquare =
      board[generateBoardKey({ x: x - delta.x, y: y - delta.y })];
    const afterSquare =
      board[generateBoardKey({ x: x + delta.x, y: y + delta.y })];

    if (beforeSquare) {
      locationsToValidate.push({
        start: beforeSquare.wordInfo[direction].start,
        direction,
      });
    }

    if (afterSquare) {
      const newStart = { x: x + delta.x, y: y + delta.y };
      iterateWordFromStart(board, newStart, direction, (square) => {
        square.wordInfo[direction].start = newStart;
      });

      locationsToValidate.push({ start: newStart, direction });
    }
  });

  const { [generateBoardKey(location)]: toRemove, ...newBoard } = board;

  validateWordsAtLocations(newBoard, locationsToValidate);

  return newBoard;
}
