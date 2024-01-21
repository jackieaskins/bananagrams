import { screen } from "@testing-library/react";
import ShuffleHandButton from "./ShuffleHandButton";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { renderComponent } from "@/client/testUtils";
import { Hand } from "@/types/hand";

const mockUseCurrentPlayer = useCurrentPlayer as jest.Mock;
jest.mock("@/client/players/useCurrentPlayer", () => ({
  useCurrentPlayer: jest.fn(),
}));

const mockHandleShuffleHand = jest.fn();
jest.mock("@/client/games/GameContext", () => ({
  ...jest.requireActual("@/client/games/GameContext"),
  useGame: () => ({
    handleShuffleHand: mockHandleShuffleHand,
  }),
}));

describe.each([{ hideText: true }, { hideText: false }])(
  "<ShuffleHandButton hideText={$hideText} />",
  ({ hideText }) => {
    function renderButton({ hand }: { hand: Hand }) {
      mockUseCurrentPlayer.mockReturnValue({ hand });
      return renderComponent(<ShuffleHandButton hideText={hideText} />);
    }

    it("is disabled when one tile in hand", () => {
      renderButton({ hand: [{ id: "A1", letter: "A" }] });

      expect(
        screen.getByRole("button", { name: "Shuffle hand" }),
      ).toBeDisabled();
    });

    it("is disabled when no tiles in hand", () => {
      renderButton({ hand: [] });

      expect(
        screen.getByRole("button", { name: "Shuffle hand" }),
      ).toBeDisabled();
    });

    it("emits shuffle hand event on click", async () => {
      const { user } = renderButton({
        hand: [
          { id: "A1", letter: "A" },
          { id: "B1", letter: "B" },
        ],
      });

      await user.click(screen.getByRole("button", { name: "Shuffle hand" }));

      expect(mockHandleShuffleHand).toHaveBeenCalled();
    });

    it(`${
      hideText ? "does not display" : "displays"
    } text when hideText is ${hideText}`, () => {
      renderButton({ hand: [] });

      expect(
        screen.getByRole("button", { name: "Shuffle hand" }),
      ).toHaveTextContent(hideText ? "" : "Shuffle hand");
    });
  },
);
