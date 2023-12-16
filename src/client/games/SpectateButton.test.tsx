import { screen, waitFor, within } from "@testing-library/react";
import { PlayerStatus } from "../../types/player";
import { socket } from "../socket";
import { renderComponent } from "../testUtils";
import SpectateButton from "./SpectateButton";

describe.each([{ hideText: true }, { hideText: false }])(
  "<SpectateButton hideText={$hideText} />",
  ({ hideText }) => {
    function renderButton() {
      return renderComponent(<SpectateButton hideText={hideText} />);
    }

    it("emits setStatus on confirmation", async () => {
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
        expect(socket.emit).toHaveBeenCalledWith("setStatus", {
          status: PlayerStatus.SPECTATING,
        });
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
