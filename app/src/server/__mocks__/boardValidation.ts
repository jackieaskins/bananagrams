import { generateBoardKey } from "@/server/boardKey";

export const validateAddTile = jest
  .fn()
  .mockImplementation((squares, location, tile) => {
    squares[generateBoardKey(location)] = { tile };
    return squares;
  });

export const validateRemoveTile = jest
  .fn()
  .mockImplementation((squares, location) => {
    const { [generateBoardKey(location)]: toRemove, ...newSquares } = squares;
    return newSquares;
  });
