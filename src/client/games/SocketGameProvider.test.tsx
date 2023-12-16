import { shallow } from "enzyme";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gameInfoFixture } from "../fixtures/game";
import { socket } from "../socket";
import SocketGameProvider from "./SocketGameProvider";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: jest.fn().mockReturnValue({
    pathname: "/pathname",
  }),
  useParams: () => ({ gameId: "gameId" }),
}));

const mockEmit = socket.emit as jest.Mock;
const mockOn = socket.on as jest.Mock;
const mockOff = socket.off as jest.Mock;

describe("<SocketGameProvider />", () => {
  const mockSetGameInfo = jest.fn();
  const mockSetIsInGame = jest.fn();

  const renderComponent = () =>
    shallow(<SocketGameProvider>Children</SocketGameProvider>);

  beforeEach(() => {
    useState
      .mockImplementationOnce((initialValue) => [initialValue, mockSetGameInfo])
      .mockImplementationOnce((initialValue) => [
        initialValue,
        mockSetIsInGame,
      ]);
  });

  test("renders properly", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe("handle methods", () => {
    const boardLocation = { x: 0, y: 0 };
    const id = "id";

    const getGameState = () => renderComponent().props().gameState;

    test("handleDump", () => {
      getGameState().handleDump({ boardLocation, id });

      expect(mockEmit).toHaveBeenCalledWith("dump", {
        boardLocation,
        tileId: id,
      });
    });

    test("handleMoveTileFromHandToBoard", () => {
      getGameState().handleMoveTileFromHandToBoard(id, boardLocation);

      expect(mockEmit).toHaveBeenCalledWith("moveTileFromHandToBoard", {
        tileId: id,
        boardLocation,
      });
    });

    test("handleMoveTileFromBoardToHand", () => {
      getGameState().handleMoveTileFromBoardToHand(boardLocation);

      expect(mockEmit).toHaveBeenCalledWith("moveTileFromBoardToHand", {
        boardLocation,
      });
    });

    test("handleMoveTileOnBoard", () => {
      getGameState().handleMoveTileOnBoard(boardLocation, boardLocation);

      expect(mockEmit).toHaveBeenCalledWith("moveTileOnBoard", {
        fromLocation: boardLocation,
        toLocation: boardLocation,
      });
    });

    test("handlePeel", () => {
      getGameState().handlePeel();

      expect(mockEmit).toHaveBeenCalledWith("peel", null);
    });
  });

  describe("mount/unmount game management", () => {
    const callComponentMount = () => {
      renderComponent();
      return useEffect.mock.calls[0][0]();
    };

    describe("if in game", () => {
      beforeEach(() => {
        useLocation.mockReturnValue({
          pathname: "/pathname",
          state: {
            gameInfo: gameInfoFixture(),
            isInGame: true,
          },
        });
      });

      test("removes router state", () => {
        callComponentMount();
        expect(mockNavigate).toHaveBeenCalledWith("/pathname", {
          replace: true,
        });
      });

      test("emits leave game event on dismount", () => {
        callComponentMount()();

        expect(mockEmit).toHaveBeenCalledWith("leaveGame", null);
      });
    });

    test("if not in game does not do any dismount actions", () => {
      useLocation.mockReturnValue({ pathname: "/pathname" });

      expect(callComponentMount()).toBeUndefined();
    });
  });

  describe("mount/unmount game info management", () => {
    const callComponentMount = () => {
      renderComponent();
      return useEffect.mock.calls[1][0]();
    };

    test("listens on game info events", () => {
      callComponentMount();

      expect(mockOn).toHaveBeenCalledWith("gameInfo", expect.any(Function));
    });

    test("sets game info on change", () => {
      const gameInfo = gameInfoFixture();

      callComponentMount();
      mockOn.mock.calls[0][1](gameInfo);

      expect(mockSetGameInfo).toHaveBeenCalledWith(gameInfo);
    });

    test("stops listening for game info on dismount", () => {
      callComponentMount()();

      expect(mockOff).toHaveBeenCalledWith("gameInfo");
    });
  });
});
