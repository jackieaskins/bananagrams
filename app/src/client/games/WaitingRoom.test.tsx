import { ChakraProvider } from "@chakra-ui/react";
import { screen, waitFor } from "@testing-library/react";
import { useGame } from "./GameContext";
import WaitingRoom from "./WaitingRoom";
import { gameInfoFixture } from "@/client/fixtures/game";
import { playerFixture } from "@/client/fixtures/player";
import { socket } from "@/client/socket";
import { renderComponent } from "@/client/testUtils";
import { Player, PlayerStatus } from "@/types/player";

jest.mock("../boards/OpponentBoardPreview", () =>
  jest.fn(() => <div>Preview</div>),
);
jest.mock("../players/PlayerTable", () => jest.fn(() => <table />));

const mockUseGame = useGame as jest.Mock;
jest.mock("./GameContext", () => ({
  ...jest.requireActual("./GameContext"),
  useGame: jest.fn(),
}));

function renderRoom(
  players: Player[] = [playerFixture()],
  previousSnapshot?: Player[],
) {
  mockUseGame.mockReturnValue({
    gameInfo: gameInfoFixture({ players, previousSnapshot }),
  });

  return renderComponent(
    <ChakraProvider>
      <WaitingRoom />
    </ChakraProvider>,
  );
}

describe("<WaitingRoom />", () => {
  describe("copy invite button", () => {
    async function renderAndClickCopyButton() {
      const { user } = renderRoom();

      await user.click(
        screen.getByRole("button", { name: "Copy invite link" }),
      );
    }

    it("copies the invite link on click", async () => {
      await renderAndClickCopyButton();

      await waitFor(async () => {
        expect(await window.navigator.clipboard.readText()).toBe(
          "http://localhost//join",
        );
      });
    });

    it("shows error toast on error", async () => {
      jest
        .spyOn(window.navigator.clipboard, "writeText")
        .mockRejectedValue(new Error("Can't copy"));

      await renderAndClickCopyButton();

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(
          "Unable to copy invite link, try copying the current page URL directly",
        );
      });
    });

    it("shows success toast on success", async () => {
      await renderAndClickCopyButton();

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(
          "Successfully copied invite link to clipboard",
        );
      });
    });
  });

  describe("start game button", () => {
    function getStartGameButton() {
      return screen.getByRole("button", { name: "Start game" });
    }

    it("is disabled if there are no active players", () => {
      renderRoom([
        playerFixture({ status: PlayerStatus.SPECTATING }),
        playerFixture({ status: PlayerStatus.SPECTATING }),
      ]);

      expect(getStartGameButton()).toBeDisabled();
    });

    it("is disabled if any player is not ready", () => {
      renderRoom([
        playerFixture({ status: PlayerStatus.NOT_READY }),
        playerFixture({ status: PlayerStatus.READY }),
      ]);

      expect(getStartGameButton()).toBeDisabled();
    });

    it("emits split event", async () => {
      const { user } = renderRoom([
        playerFixture({ status: PlayerStatus.SPECTATING }),
        playerFixture({ status: PlayerStatus.SPECTATING }),
        playerFixture({ status: PlayerStatus.READY }),
      ]);

      await user.click(getStartGameButton());

      await waitFor(() => {
        expect(socket.emit).toHaveBeenCalledWith("split", null);
      });
    });
  });

  describe("opponent preview", () => {
    it("does not render opponent preview when no snapshot", () => {
      renderRoom();

      expect(
        screen.queryByText("Here are the boards from that round:"),
      ).not.toBeInTheDocument();
    });

    it("renders opponent preview when snapshot", () => {
      renderRoom([playerFixture()], [playerFixture()]);

      expect(
        screen.getByText("Here are the boards from that round:"),
      ).toBeInTheDocument();
    });
  });
});
