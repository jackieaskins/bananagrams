import { screen } from "@testing-library/react";
import { getEmptyGameInfo, useGame } from "./GameContext";
import SpectatorView from "./SpectatorView";
import { playerFixture } from "@/client/fixtures/player";
import { renderComponent } from "@/client/testUtils";
import { PlayerStatus } from "@/types/player";

const mockUseGame = useGame as jest.Mock;
jest.mock("./GameContext", () => ({
  ...jest.requireActual("./GameContext"),
  useGame: jest.fn(),
}));

function renderView() {
  return renderComponent(<SpectatorView />);
}

describe("<SpectatorView />", () => {
  beforeEach(() => {
    mockUseGame.mockReturnValue({ gameInfo: getEmptyGameInfo("123") });
  });

  it("renders heading", () => {
    renderView();

    expect(screen.getByRole("heading")).toHaveTextContent(/^Spectator view$/);
  });

  it("renders remaining tile count", () => {
    mockUseGame.mockReturnValue({
      gameInfo: { players: [], bunch: [{ id: "A1", letter: "A" }] },
    });
    renderView();

    expect(screen.getByText("Remaining tiles: 1")).toBeInTheDocument();
  });

  it("renders preview for each active player", () => {
    mockUseGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [
          playerFixture({
            username: "player1",
            status: PlayerStatus.SPECTATING,
          }),
          playerFixture({ username: "player2", status: PlayerStatus.READY }),
          playerFixture({ username: "player3", status: PlayerStatus.READY }),
        ],
      },
    });
    renderView();

    expect(screen.queryByText("player1")).not.toBeInTheDocument();
    expect(screen.getByText("player2")).toBeInTheDocument();
    expect(screen.getByText("player3")).toBeInTheDocument();
  });
});
