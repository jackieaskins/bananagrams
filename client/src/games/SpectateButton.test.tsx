import { screen, waitFor, within } from "@testing-library/react";
import { PlayerStatus } from "../players/types";
import { renderComponent } from "../testUtils";
import SpectateButton from "./SpectateButton";

const mockEmit = jest.fn();
jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: { emit: mockEmit },
  }),
}));

function renderButton() {
  return renderComponent(<SpectateButton />);
}

describe("<SpectateButton />", () => {
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
      expect(mockEmit).toHaveBeenCalledWith("setStatus", {
        status: PlayerStatus.SPECTATING,
      });
    });
  });
});
