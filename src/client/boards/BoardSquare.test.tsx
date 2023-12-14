/* eslint-disable testing-library/no-render-in-lifecycle */
import { shallow } from "enzyme";
import { useDrop } from "react-dnd";
import {
  BoardLocation,
  BoardSquare as BoardSquareType,
  Direction,
  ValidationStatus,
  WordInfo,
} from "../../types/board";
import { useEnableTileSwap } from "../LocalStorageContext";
import { boardSquareFixture, wordInfoFixture } from "../fixtures/board";
import BoardSquare from "./BoardSquare";

const mockUseEnableTileSwap = useEnableTileSwap as jest.Mock;
jest.mock("../LocalStorageContext", () => ({
  useEnableTileSwap: jest.fn().mockReturnValue([false]),
}));

const mockUseDrop = useDrop as jest.Mock;
jest.mock("react-dnd", () => ({
  useDrop: jest.fn(),
}));

const mockHandleMoveTileFromHandToBoard = jest.fn();
const mockHandleMoveTileOnBoard = jest.fn();
jest.mock("../games/GameContext", () => ({
  useGame: () => ({
    handleMoveTileFromHandToBoard: mockHandleMoveTileFromHandToBoard,
    handleMoveTileOnBoard: mockHandleMoveTileOnBoard,
  }),
}));

describe("<BoardSquare />", () => {
  const getBoardSquare = (
    across: WordInfo = wordInfoFixture(),
    down: WordInfo = wordInfoFixture(),
  ): BoardSquareType =>
    boardSquareFixture({
      wordInfo: {
        [Direction.ACROSS]: across,
        [Direction.DOWN]: down,
      },
    });

  const renderComponent = (propOverrides = {}) =>
    shallow(<BoardSquare boardSquare={null} x={0} y={0} {...propOverrides} />);

  beforeEach(() => {
    mockUseDrop.mockReturnValue([{ canDrop: true, isOver: false }, jest.fn()]);
  });

  it("renders properly when is over and can drop", () => {
    mockUseDrop.mockReturnValue([{ canDrop: true, isOver: true }, jest.fn()]);

    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders properly with null boardSquare", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders black tile when not validated in any direction", () => {
    const boardSquare = getBoardSquare(
      wordInfoFixture({ validation: ValidationStatus.NOT_VALIDATED }),
      wordInfoFixture({ validation: ValidationStatus.NOT_VALIDATED }),
    );

    expect(renderComponent({ boardSquare })).toMatchSnapshot();
  });

  it("renders green tile when valid in every direction", () => {
    const boardSquare = getBoardSquare(
      wordInfoFixture({ validation: ValidationStatus.VALID }),
      wordInfoFixture({ validation: ValidationStatus.VALID }),
    );

    expect(renderComponent({ boardSquare })).toMatchSnapshot();
  });

  it("renders red tile when invalid in any direction", () => {
    const boardSquare = getBoardSquare(
      wordInfoFixture({ validation: ValidationStatus.VALID }),
      wordInfoFixture({ validation: ValidationStatus.INVALID }),
    );

    expect(renderComponent({ boardSquare })).toMatchSnapshot();
  });

  describe("useDrop", () => {
    it("is called", () => {
      renderComponent();

      expect(mockUseDrop).toHaveBeenCalledWith({
        accept: "TILE",
        canDrop: expect.any(Function),
        drop: expect.any(Function),
        collect: expect.any(Function),
      });
    });

    describe("canDrop", () => {
      const callCanDrop = (monitor) =>
        mockUseDrop.mock.calls[0][0].canDrop({}, monitor);

      it.each([
        { canDrop: true, isOver: true, swapTiles: true, tileExists: true },
        { canDrop: true, isOver: true, swapTiles: true, tileExists: false },
        { canDrop: false, isOver: true, swapTiles: false, tileExists: true },
        { canDrop: true, isOver: true, swapTiles: false, tileExists: false },
        { canDrop: false, isOver: false, swapTiles: true, tileExists: true },
        { canDrop: false, isOver: false, swapTiles: true, tileExists: false },
        { canDrop: false, isOver: false, swapTiles: false, tileExists: true },
        { canDrop: false, isOver: false, swapTiles: false, tileExists: false },
      ])(
        "returns $canDrop when monitor over is $isOver, enable tile swap is $swapTiles, and tile exists is $tileExists",
        ({ canDrop, isOver, swapTiles, tileExists }) => {
          mockUseEnableTileSwap.mockReturnValue([swapTiles]);

          renderComponent({
            boardSquare: tileExists ? boardSquareFixture() : null,
          });

          expect(callCanDrop({ isOver: () => isOver })).toBe(canDrop);
        },
      );

      it("returns true if monitor is over and no tile exists", () => {
        renderComponent();

        expect(
          callCanDrop({
            isOver: () => true,
          }),
        ).toBe(true);
      });

      it("returns false if monitor is not over but no tile exists", () => {
        renderComponent();

        expect(
          callCanDrop({
            isOver: () => false,
          }),
        ).toBe(false);
      });

      it("returns false if monitor is over and a tile exists", () => {
        renderComponent({ boardSquare: boardSquareFixture() });

        expect(
          callCanDrop({
            isOver: () => true,
          }),
        ).toBe(false);
      });

      it("returns false if monitor is not over and a tile exists", () => {
        renderComponent({ boardSquare: boardSquareFixture() });

        expect(
          callCanDrop({
            isOver: () => false,
          }),
        ).toBe(false);
      });
    });

    describe("drop", () => {
      const callDrop = (boardLocation: BoardLocation | null) =>
        mockUseDrop.mock.calls[0][0].drop({ id: "id", boardLocation });

      beforeEach(() => {
        renderComponent();
      });

      it("moves tile to new location on board if tile is already on board", () => {
        const boardLocation = { x: 1, y: 1 };
        callDrop(boardLocation);

        expect(mockHandleMoveTileOnBoard).toHaveBeenCalledWith(boardLocation, {
          x: 0,
          y: 0,
        });
      });

      it("moves tile from hand to board if tile is not on board", () => {
        callDrop(null);

        expect(mockHandleMoveTileFromHandToBoard).toHaveBeenCalledWith("id", {
          x: 0,
          y: 0,
        });
      });
    });

    describe("collect", () => {
      const mockIsOver = jest.fn().mockReturnValue("isOver");
      const mockCanDrop = jest.fn().mockReturnValue("canDrop");

      const callUseDrop = () =>
        mockUseDrop.mock.calls[0][0].collect({
          isOver: mockIsOver,
          canDrop: mockCanDrop,
        });

      beforeEach(() => {
        renderComponent();
      });

      it("calls monitor isOver", () => {
        callUseDrop();

        expect(mockIsOver).toHaveBeenCalledWith({ shallow: true });
      });

      it("calls monitor canDrop", () => {
        callUseDrop();

        expect(mockCanDrop).toHaveBeenCalledWith();
      });

      it("returns the expected valud", () => {
        expect(callUseDrop()).toEqual({
          isOver: "isOver",
          canDrop: "canDrop",
        });
      });
    });
  });
});
