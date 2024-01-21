import { screen, waitFor } from "@testing-library/react";
import { useGame } from "./GameContext";
import PeelButton from "./PeelButton";
import { isValidConnectedBoard } from "@/client/boards/validate";
import { gameInfoFixture } from "@/client/fixtures/game";
import { playerFixture } from "@/client/fixtures/player";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { renderComponent } from "@/client/testUtils";
import { Board } from "@/types/board";
import { Bunch } from "@/types/bunch";
import { Hand } from "@/types/hand";
import { Player, PlayerStatus } from "@/types/player";

const mockHandlePeel = jest.fn();

const mockIsValidConnectedBoard = isValidConnectedBoard as jest.Mock;
jest.mock("../boards/validate", () => ({
  isValidConnectedBoard: jest.fn(),
}));

const mockUseCurrentPlayer = useCurrentPlayer as jest.Mock;
jest.mock("@/client/players/useCurrentPlayer", () => ({
  useCurrentPlayer: jest.fn(),
}));

const mockUseGame = useGame as jest.Mock;
jest.mock("./GameContext", () => ({
  ...jest.requireActual("./GameContext"),
  useGame: jest.fn(),
}));

describe.each([{ hideText: true }, { hideText: false }])(
  "<PeelButton hideText={$hideText} />",
  ({ hideText }) => {
    function renderButton({
      isBoardValid = true,
      hand = [],
      board = {},
      bunch = [],
      players = [],
    }: Partial<{
      hideText: boolean;
      isBoardValid: boolean;
      hand: Hand;
      board: Board;
      bunch: Bunch;
      players: Player[];
    }> = {}) {
      mockIsValidConnectedBoard.mockReturnValue(isBoardValid);
      mockUseCurrentPlayer.mockReturnValue({ hand, board });
      mockUseGame.mockReturnValue({
        gameInfo: gameInfoFixture({ bunch, players }),
        handlePeel: mockHandlePeel,
      });

      return renderComponent(<PeelButton hideText={hideText} />);
    }

    describe("tooltip text", () => {
      it("gives help on how to disable button if hand is not empty", async () => {
        const { user } = renderButton({
          hand: [{ id: "A1", letter: "A" }],
          isBoardValid: true,
        });

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        await user.hover(screen.getByRole("button"));

        await waitFor(() => {
          expect(screen.getByRole("tooltip")).toHaveTextContent(
            "You must have a valid connected board to peel",
          );
        });
      });

      it("gives help on how to disable button if board is not valid", async () => {
        const { user } = renderButton({ hand: [], isBoardValid: false });

        await user.hover(screen.getByRole("button"));

        await waitFor(() => {
          expect(screen.getByRole("tooltip")).toHaveTextContent(
            "You must have a valid connected board to peel",
          );
        });
      });

      it("shows win game text when can peel and there are fewer tiles than active players", async () => {
        const { user } = renderButton({
          bunch: [{ letter: "B", id: "B1" }],
          players: [
            playerFixture({ status: PlayerStatus.READY }),
            playerFixture({ status: PlayerStatus.READY }),
          ],
        });

        await user.hover(screen.getByRole("button"));

        await waitFor(() => {
          expect(screen.getByRole("tooltip")).toHaveTextContent(
            "Win the game!",
          );
        });
      });

      it("shows peel description when can peel but peel does not win game", async () => {
        const { user } = renderButton({
          bunch: [
            { letter: "B", id: "B1" },
            { letter: "C", id: "C1" },
          ],
          players: [playerFixture({ status: PlayerStatus.READY })],
        });

        await user.hover(screen.getByRole("button"));

        await waitFor(() => {
          expect(screen.getByRole("tooltip")).toHaveTextContent(
            "Get a new tile and send one to everyone else",
          );
        });
      });
    });

    describe("button text", () => {
      it("shows bananas when there are fewer tiles than active players", () => {
        renderButton({
          bunch: [],
          players: [playerFixture({ status: PlayerStatus.READY })],
        });

        expect(
          screen.getByRole("button", { name: "Bananas!" }),
        ).toBeInTheDocument();
      });

      it("shows peel when there are equal tiles and active players", () => {
        renderButton({
          bunch: [{ id: "B1", letter: "B" }],
          players: [playerFixture({ status: PlayerStatus.READY })],
        });

        expect(
          screen.getByRole("button", { name: "Peel!" }),
        ).toBeInTheDocument();
      });

      it("shows peel when there are more tiles than active players", () => {
        renderButton({
          bunch: [
            { id: "B1", letter: "B" },
            { id: "C1", letter: "C" },
          ],
          players: [playerFixture({ status: PlayerStatus.READY })],
        });

        expect(
          screen.getByRole("button", { name: "Peel!" }),
        ).toBeInTheDocument();
      });
    });

    describe("disabled state", () => {
      it("is disabled when hand is not empty", () => {
        renderButton({ hand: [{ id: "A1", letter: "A" }], isBoardValid: true });

        expect(screen.getByRole("button")).toBeDisabled();
      });

      it("is disabled when board is not valid", () => {
        renderButton({ isBoardValid: false, hand: [] });

        expect(screen.getByRole("button")).toBeDisabled();
      });

      it("is not disabled when hand is empty and board is valid", () => {
        renderButton({ isBoardValid: true, hand: [] });

        expect(screen.getByRole("button")).toBeEnabled();
      });
    });

    it(`${
      hideText ? "does not display" : "displays"
    } text when hideText is ${hideText}`, () => {
      renderButton();

      expect(screen.getByRole("button", { name: "Peel!" })).toHaveTextContent(
        hideText ? "" : "Peel!",
      );
    });
  },
);
