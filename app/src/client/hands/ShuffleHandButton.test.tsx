import { screen } from "@testing-library/react";
import ShuffleHandButton from "./ShuffleHandButton";
import { useCurrentPlayer } from "@/client/redesign/useCurrentPlayer";
import { socket } from "@/client/socket";
import { renderComponent } from "@/client/testUtils";
import { Hand } from "@/types/hand";

const mockUseCurrentPlayer = useCurrentPlayer as jest.Mock;
jest.mock("../redesign/useCurrentPlayer", () => ({
  useCurrentPlayer: jest.fn(),
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

      expect(socket.emit).toHaveBeenCalledWith("shuffleHand", null);
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
