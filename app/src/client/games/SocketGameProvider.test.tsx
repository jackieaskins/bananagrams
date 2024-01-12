import { act, renderHook, waitFor } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { useGame } from "./GameContext";
import SocketGameProvider from "./SocketGameProvider";
import { gameInfoFixture } from "@/client/fixtures/game";
import { socket } from "@/client/socket";

const mockNavigate = jest.fn();
const mockUseLocation = useLocation as jest.Mock;
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

function renderProviderWithHook() {
  return renderHook(useGame, { wrapper: SocketGameProvider });
}

describe("<SocketGameProvider />", () => {
  describe("mount/unmount game management", () => {
    describe("if in game", () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue({
          pathname: "/pathname",
          state: {
            gameInfo: gameInfoFixture(),
            isInGame: true,
          },
        });
      });

      it("properly sets state", () => {
        const { result } = renderProviderWithHook();

        expect(result.current.isInGame).toBe(true);
      });

      it("removes router state", () => {
        renderProviderWithHook();

        expect(mockNavigate).toHaveBeenCalledWith("/pathname", {
          replace: true,
        });
      });

      it("emits leave game event on dismount", () => {
        const { unmount } = renderProviderWithHook();

        expect(mockEmit).not.toHaveBeenCalled();

        unmount();

        expect(mockEmit).toHaveBeenCalledWith("leaveGame", null);
      });
    });

    describe("if not in game", () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue({ pathname: "/pathname" });
      });

      it("properly sets state", () => {
        const { result } = renderProviderWithHook();

        expect(result.current.isInGame).toBe(false);
      });

      it("does not remove router state", () => {
        renderProviderWithHook();

        expect(mockNavigate).not.toHaveBeenCalled();
      });

      it("does not emit leaveGame event on unmount", () => {
        const { unmount } = renderProviderWithHook();

        unmount();

        expect(mockEmit).not.toHaveBeenCalled();
      });
    });
  });

  describe("mount/unmount game info management", () => {
    it("listens on game info events", () => {
      renderProviderWithHook();

      expect(mockOn).toHaveBeenCalledWith("gameInfo", expect.any(Function));
    });

    it("sets game info on game info event", async () => {
      const gameInfo = gameInfoFixture({ gameName: "newGameName" });

      const { result } = renderProviderWithHook();

      expect(result.current.gameInfo).not.toEqual(gameInfo);

      act(() => {
        mockOn.mock.calls[0][1](gameInfo);
      });

      await waitFor(() => {
        expect(result.current.gameInfo).toEqual(gameInfo);
      });
    });

    it("stops listening for game info on dismount", () => {
      const { unmount } = renderProviderWithHook();

      expect(mockOff).not.toHaveBeenCalled();

      unmount();

      expect(mockOff).toHaveBeenCalledWith("gameInfo");
    });
  });

  describe("handle methods", () => {
    const boardLocation = { x: 0, y: 0 };
    const id = "id";

    const getGameState = () => renderProviderWithHook().result.current;

    it("emits dump event on handleDump", () => {
      getGameState().handleDump({ boardLocation, id, type: "tile" });

      expect(mockEmit).toHaveBeenCalledWith("dump", {
        boardLocation,
        tileId: id,
      });
    });

    it("emits moveTileFromHandToBoard event on handleMoveTileFromHandToBoard", () => {
      getGameState().handleMoveTileFromHandToBoard(id, boardLocation);

      expect(mockEmit).toHaveBeenCalledWith("moveTileFromHandToBoard", {
        tileId: id,
        boardLocation,
      });
    });

    it("emits moveTileFromBoardTo event on handleMoveTileFromBoardToHand", () => {
      getGameState().handleMoveTileFromBoardToHand(boardLocation);

      expect(mockEmit).toHaveBeenCalledWith("moveTileFromBoardToHand", {
        boardLocation,
      });
    });

    it("emits moveTileOnBoard event on handleMoveTileOnBoard", () => {
      getGameState().handleMoveTileOnBoard(boardLocation, boardLocation);

      expect(mockEmit).toHaveBeenCalledWith("moveTileOnBoard", {
        fromLocation: boardLocation,
        toLocation: boardLocation,
      });
    });

    it("emits peel event on handlePeel", () => {
      getGameState().handlePeel();

      expect(mockEmit).toHaveBeenCalledWith("peel", null);
    });
  });
});
