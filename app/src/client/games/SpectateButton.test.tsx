import { screen, waitFor, within } from "@testing-library/react";
import SpectateButton from "./SpectateButton";
import { renderComponent } from "@/client/testUtils";

const mockHandleSpectate = jest.fn();
jest.mock("./GameContext", () => ({
  ...jest.requireActual("./GameContext"),
  useGame: () => ({
    handleSpectate: mockHandleSpectate,
  }),
}));

describe.each([{ hideText: true }, { hideText: false }])(
  "<SpectateButton hideText={$hideText} />",
  ({ hideText }) => {
    function renderButton() {
      return renderComponent(<SpectateButton hideText={hideText} />);
    }

    it("emits handleSpectate event", async () => {
      const { user } = renderButton();

      await user.click(
        screen.getByRole("button", { name: "Switch to spectator" }),
      );

      await waitFor(async () => {
        await user.click(
          within(screen.getByRole("dialog")).getByRole("button", {
            name: "Spectate",
          }),
        );
      });

      await waitFor(() => {
        expect(mockHandleSpectate).toHaveBeenCalled();
      });
    });

    it(`${
      hideText ? "does not display" : "displays"
    } text when hideText is ${hideText}`, () => {
      renderButton();

      expect(
        screen.getByRole("button", { name: "Switch to spectator" }),
      ).toHaveTextContent(hideText ? "" : "Switch to spectator");
    });
  },
);
