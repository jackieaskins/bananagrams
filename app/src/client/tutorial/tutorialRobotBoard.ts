import { Board, ValidationStatus } from "@/types/board";
import { Letter } from "@/types/tile";

const tiles = {
  "7,4": "W99",
  "8,4": "O99",
  "9,4": "R99",
  "10,4": "L99",
  "11,4": "D99",
  "11,5": "O98",
  "11,6": "M99",
  "11,7": "I99",
  "11,8": "N99",
  "11,9": "A99",
  "11,10": "T99",
  "11,11": "I98",
  "11,12": "O97",
  "11,13": "N98",
};

export const tutorialRobotBoard: Board = Object.fromEntries(
  Object.entries(tiles).map(([boardKey, tileId]) => [
    boardKey,
    {
      tile: { id: tileId, letter: tileId.charAt(0) as Letter },
      wordInfo: {
        ACROSS: { start: { x: 7, y: 4 }, validation: ValidationStatus.VALID },
        DOWN: { start: { x: 11, y: 4 }, validation: ValidationStatus.VALID },
      },
    },
  ]),
);
