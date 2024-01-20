import { screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import OpponentBoardPreview from "./OpponentBoardPreview";
import { playerFixture } from "@/client/fixtures/player";
import { CURRENT_PLAYER_ID, renderComponent } from "@/client/testUtils";

describe("<OpponentBoardPreview />", () => {
  const renderPreview = (propOverrides = {}) =>
    renderComponent(
      <OpponentBoardPreview
        players={[playerFixture({ userId: CURRENT_PLAYER_ID })]}
        {...propOverrides}
      />,
    );

  it("does not render if no opponents", () => {
    const { asFragment } = renderPreview();

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders current player if includeCurrentPlayer", () => {
    const username = "this-is-the-current-player-username";
    renderPreview({
      includeCurrentPlayer: true,
      players: [playerFixture({ userId: CURRENT_PLAYER_ID, username })],
    });

    expect(screen.getByText(username)).toBeInTheDocument();
  });

  it("renders properly with one opponent and no current player", () => {
    const currentPlayerUsername = "current-player-username";
    const opponentUsername = "this-is-the-opponent-username";

    renderPreview({
      players: [
        playerFixture({
          userId: CURRENT_PLAYER_ID,
          username: currentPlayerUsername,
        }),
        playerFixture({ userId: "opponent", username: opponentUsername }),
      ],
    });

    expect(screen.getByText(opponentUsername)).toBeInTheDocument();
    expect(screen.queryByText(currentPlayerUsername)).not.toBeInTheDocument();
    // Ensure select is not rendered with one opponent
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "See previous opponent's board" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "See next opponent's board" }),
    ).not.toBeInTheDocument();
  });

  describe("with multiple opponents", () => {
    const firstUsername = "opponent";
    const secondUsername = "other";
    const thirdUsername = "third";

    function renderPreviewWithOpponents(initialPlayerIndex?: number) {
      return renderPreview({
        players: [
          playerFixture({ userId: "opponent", username: firstUsername }),
          playerFixture({ userId: "opponent2", username: secondUsername }),
          playerFixture({ userId: "opponent3", username: thirdUsername }),
        ],
        initialPlayerIndex,
      });
    }

    it("selects first opponent by default", () => {
      renderPreviewWithOpponents();

      expect(screen.getByRole("combobox")).toHaveDisplayValue(firstUsername);
      expect(screen.getByRole("combobox")).not.toHaveDisplayValue(
        secondUsername,
      );
    });

    it("selects second opponent if initialPlayerIndex is 1", () => {
      renderPreviewWithOpponents(1);

      expect(screen.getByRole("combobox")).toHaveDisplayValue(secondUsername);
    });

    it("navigates between boards when clicking previous button", async () => {
      const { user } = renderPreviewWithOpponents();

      expect(screen.getByRole("combobox")).toHaveDisplayValue(firstUsername);

      await act(async () => {
        await user.click(
          screen.getByRole("button", { name: "See previous opponent's board" }),
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveDisplayValue(thirdUsername);
      });

      await act(async () => {
        await user.click(
          screen.getByRole("button", { name: "See previous opponent's board" }),
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveDisplayValue(secondUsername);
      });

      await act(async () => {
        await user.click(
          screen.getByRole("button", { name: "See previous opponent's board" }),
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveDisplayValue(firstUsername);
      });
    });

    it("navigates between boards when clicking next button", async () => {
      const { user } = renderPreviewWithOpponents();

      expect(screen.getByRole("combobox")).toHaveDisplayValue(firstUsername);

      await act(async () => {
        await user.click(
          screen.getByRole("button", { name: "See next opponent's board" }),
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveDisplayValue(secondUsername);
      });

      await act(async () => {
        await user.click(
          screen.getByRole("button", { name: "See next opponent's board" }),
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveDisplayValue(thirdUsername);
      });

      await act(async () => {
        await user.click(
          screen.getByRole("button", { name: "See next opponent's board" }),
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveDisplayValue(firstUsername);
      });
    });
  });
});
