import { generateBoardKey, parseBoardKey } from "@/client/boards/key";
import {
  Board,
  BoardLocation,
  Direction,
  ValidationStatus,
} from "@/types/board";
import { Letter, Tile } from "@/types/tile";

const DICTIONARY = new Set([
  "ad",
  "as",
  "at",
  "ads",
  "art",
  "arts",
  "dart",
  "darts",
  "drat",
  "drats",
  "rad",
  "rat",
  "rats",
  "sad",
  "sat",
  "star",
  "ta",
  "tad",
  "tads",
  "tar",
  "tars",
  "tsar",
]);

function getValidations(
  boardSquares: Record<string, Tile>,
  diff: BoardLocation,
) {
  const visited = new Set<string>();
  const validations: Record<
    string,
    {
      validation: ValidationStatus;
      start: BoardLocation;
    }
  > = {};

  Object.entries(boardSquares).forEach(([boardKey]) => {
    if (visited.has(boardKey)) {
      return;
    }

    const { x, y } = parseBoardKey(boardKey);

    // Find start
    let start = { x, y };
    while (
      boardSquares[
        generateBoardKey({
          x: start.x - diff.x,
          y: start.y - diff.y,
        })
      ]
    ) {
      start = { x: start.x - diff.x, y: start.y - diff.y };
    }

    const letters: Letter[] = [];
    const wordLocations: string[] = [];
    let next = start;
    while (boardSquares[generateBoardKey(next)]) {
      const boardKey = generateBoardKey(next);
      visited.add(boardKey);
      letters.push(boardSquares[boardKey].letter);
      wordLocations.push(boardKey);
      next = {
        x: next.x + diff.x,
        y: next.y + diff.y,
      };
    }

    const validation =
      letters.length === 1
        ? ValidationStatus.NOT_VALIDATED
        : DICTIONARY.has(letters.join("").toLowerCase())
          ? ValidationStatus.VALID
          : ValidationStatus.INVALID;

    wordLocations.forEach((key) => {
      validations[key] = { validation, start };
    });
  });

  return validations;
}

export function validateBoardSquares(
  boardSquares: Record<string, Tile>,
): Board {
  const horizontalValidations = getValidations(boardSquares, { x: 1, y: 0 });
  const verticalValidations = getValidations(boardSquares, { x: 0, y: 1 });

  return Object.fromEntries(
    Object.entries(boardSquares).map(([boardKey, tile]) => [
      boardKey,
      {
        tile,
        wordInfo: {
          [Direction.DOWN]: verticalValidations[boardKey],
          [Direction.ACROSS]: horizontalValidations[boardKey],
        },
      },
    ]),
  );
}
