import { renderHook } from "@testing-library/react";
import { GameContext, getEmptyGameInfo, useGame } from "./GameContext";

const mockHandleDump = jest.fn();
const mockHandleMoveTileFromHandToBoard = jest.fn();
const mockHandleMoveTileFromBoardToHand = jest.fn();
const mockHandleMoveTileOnBoard = jest.fn();
const mockHandlePeel = jest.fn();
const mockHandleShuffleHand = jest.fn();
const mockHandleSpectate = jest.fn();

const gameInfo = getEmptyGameInfo("gameId");

function GameProvider({ children }: { children: React.ReactNode }) {
  return (
    <GameContext.Provider
      value={{
        gameInfo,
        handleDump: mockHandleDump,
        handleMoveTileFromHandToBoard: mockHandleMoveTileFromHandToBoard,
        handleMoveTileFromBoardToHand: mockHandleMoveTileFromBoardToHand,
        handleMoveTileOnBoard: mockHandleMoveTileOnBoard,
        handlePeel: mockHandlePeel,
        handleShuffleHand: mockHandleShuffleHand,
        handleSpectate: mockHandleSpectate,
        isInGame: true,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

function renderGameWithHook() {
  return renderHook(useGame, { wrapper: GameProvider });
}

describe("GameContext", () => {
  it("provides game info", () => {
    const { result } = renderGameWithHook();

    expect(result.current.gameInfo).toEqual(gameInfo);
  });

  it("provides dump handler", () => {
    const tile = { id: "A1", boardLocation: { x: 0, y: 0 } };

    const { result } = renderGameWithHook();

    result.current.handleDump(tile);

    expect(mockHandleDump).toHaveBeenCalledWith(tile);
  });

  it("provides moveTileFromHandToBoard handler", () => {
    const tileId = "A1";
    const boardLocation = { x: 0, y: 0 };

    const { result } = renderGameWithHook();

    result.current.handleMoveTileFromHandToBoard(tileId, boardLocation);

    expect(mockHandleMoveTileFromHandToBoard).toHaveBeenCalledWith(
      tileId,
      boardLocation,
    );
  });

  it("provides moveTileFromBoardToHand handler", () => {
    const boardLocation = { x: 0, y: 0 };

    const { result } = renderGameWithHook();

    result.current.handleMoveTileFromBoardToHand(boardLocation);

    expect(mockHandleMoveTileFromBoardToHand).toHaveBeenCalledWith(
      boardLocation,
    );
  });

  it("provides moveTileOnBoard handler", () => {
    const fromLocation = { x: 0, y: 0 };
    const toLocation = { x: 1, y: 1 };

    const { result } = renderGameWithHook();

    result.current.handleMoveTileOnBoard(fromLocation, toLocation);

    expect(mockHandleMoveTileOnBoard).toHaveBeenCalledWith(
      fromLocation,
      toLocation,
    );
  });

  it("provides peel handler", () => {
    const { result } = renderGameWithHook();

    result.current.handlePeel();

    expect(mockHandlePeel).toHaveBeenCalledWith();
  });

  it("provides shuffleHand handler", () => {
    const { result } = renderGameWithHook();

    result.current.handleShuffleHand();

    expect(mockHandleShuffleHand).toHaveBeenCalledWith();
  });

  it("provides spectate handler", () => {
    const { result } = renderGameWithHook();

    result.current.handleSpectate();

    expect(mockHandleSpectate).toHaveBeenCalledWith();
  });

  it("provides in game status", () => {
    const { result } = renderGameWithHook();

    expect(result.current.isInGame).toBe(true);
  });
});
