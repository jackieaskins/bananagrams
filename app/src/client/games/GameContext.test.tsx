import { renderHook } from "@testing-library/react";
import { GameContext, getEmptyGameInfo, useGame } from "./GameContext";

const mockHandleDump = jest.fn();
const mockHandleMoveTilesFromHandToBoard = jest.fn();
const mockHandleMoveTilesFromBoardToHand = jest.fn();
const mockHandleMoveTilesOnBoard = jest.fn();
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
        handleMoveTilesFromHandToBoard: mockHandleMoveTilesFromHandToBoard,
        handleMoveTilesFromBoardToHand: mockHandleMoveTilesFromBoardToHand,
        handleMoveTilesOnBoard: mockHandleMoveTilesOnBoard,
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
    const tiles = [{ tileId: "A1", boardLocation: { x: 0, y: 0 } }];

    const { result } = renderGameWithHook();

    result.current.handleDump(tiles);

    expect(mockHandleDump).toHaveBeenCalledWith(tiles);
  });

  it("provides moveTilesFromHandToBoard handler", () => {
    const tileId = "A1";
    const boardLocation = { x: 0, y: 0 };
    const tiles = [{ tileId, boardLocation }];

    const { result } = renderGameWithHook();

    result.current.handleMoveTilesFromHandToBoard(tiles);

    expect(mockHandleMoveTilesFromHandToBoard).toHaveBeenCalledWith(tiles);
  });

  it("provides moveTilesFromBoardToHand handler", () => {
    const boardLocations = [{ x: 0, y: 0 }];

    const { result } = renderGameWithHook();

    result.current.handleMoveTilesFromBoardToHand(boardLocations);

    expect(mockHandleMoveTilesFromBoardToHand).toHaveBeenCalledWith(
      boardLocations,
    );
  });

  it("provides moveTilesOnBoard handler", () => {
    const fromLocation = { x: 0, y: 0 };
    const toLocation = { x: 1, y: 1 };
    const tiles = [{ fromLocation, toLocation }];

    const { result } = renderGameWithHook();

    result.current.handleMoveTilesOnBoard(tiles);

    expect(mockHandleMoveTilesOnBoard).toHaveBeenCalledWith(tiles);
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
