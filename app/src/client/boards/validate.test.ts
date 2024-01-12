import { isValidConnectedBoard } from "./validate";
import { boardSquareFixture, wordInfoFixture } from "@/client/fixtures/board";
import { Direction, ValidationStatus } from "@/types/board";

describe("isValidConnectedBoard", () => {
  it("returns false for empty board", () => {
    expect(isValidConnectedBoard({})).toBe(false);
  });

  it("returns false if everything is valid but multiple islands", () => {
    const validWordInfo = {
      [Direction.ACROSS]: wordInfoFixture({
        validation: ValidationStatus.VALID,
      }),
      [Direction.DOWN]: wordInfoFixture({ validation: ValidationStatus.VALID }),
    };
    const board = {
      "0,0": boardSquareFixture({ wordInfo: validWordInfo }),
      "2,2": boardSquareFixture({ wordInfo: validWordInfo }),
    };

    expect(isValidConnectedBoard(board)).toBe(false);
  });

  it("returns false if one island but invalid", () => {
    const invalidWordInfo = {
      [Direction.ACROSS]: wordInfoFixture({
        validation: ValidationStatus.INVALID,
      }),
      [Direction.DOWN]: wordInfoFixture({
        validation: ValidationStatus.NOT_VALIDATED,
      }),
    };
    const board = {
      "1,0": boardSquareFixture({ wordInfo: invalidWordInfo }),
      "1,1": boardSquareFixture(),
    };

    expect(isValidConnectedBoard(board)).toBe(false);
  });

  it("returns true if nothing is invalid and board is one connected component", () => {
    const getSquare = () =>
      boardSquareFixture({
        wordInfo: {
          [Direction.ACROSS]: wordInfoFixture({
            validation: ValidationStatus.VALID,
          }),
          [Direction.DOWN]: wordInfoFixture({
            validation: ValidationStatus.NOT_VALIDATED,
          }),
        },
      });

    const board = {
      "0,0": getSquare(),
      "0,1": getSquare(),
      "0,2": getSquare(),
      "1,0": getSquare(),
      "1,2": getSquare(),
      "2,0": getSquare(),
      "2,2": getSquare(),
    };

    expect(isValidConnectedBoard(board)).toBe(true);
  });
});
