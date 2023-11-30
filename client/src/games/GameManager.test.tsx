import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { gameInfoFixture } from "../fixtures/game";
import { playerFixture } from "../fixtures/player";
import { PlayerStatus } from "../players/types";
import { renderComponent } from "../testUtils";
import { useGame } from "./GameContext";
import GameManager from "./GameManager";
import { GameState } from "./types";

const CURRENT_PLAYER_ID = "currentPlayer";

jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: { id: CURRENT_PLAYER_ID },
  }),
}));

const mockUseGame = useGame as jest.Mock;
jest.mock("./GameContext", () => ({
  ...jest.requireActual("./GameContext"),
  useGame: jest.fn(),
}));

function renderManager(gameState: Partial<GameState> = {}) {
  const game = {
    gameInfo: gameInfoFixture(),
    isInGame: false,
    ...gameState,
  };
  mockUseGame.mockReturnValue(game);

  return renderComponent(
    <MemoryRouter initialEntries={["/game/123"]}>
      <Routes>
        <Route
          path="/game/:gameId"
          element={<GameManager game={<div>GAME</div>} />}
        />
        <Route path="/game/:gameId/join" element="Join game" />
      </Routes>
    </MemoryRouter>,
  );
}

describe("<GameManager />", () => {
  it("redirects to join page if not in game", () => {
    renderManager({
      isInGame: false,
      gameInfo: gameInfoFixture({
        players: [playerFixture({ userId: CURRENT_PLAYER_ID })],
      }),
    });

    expect(screen.getByText(/^Join game$/)).toBeInTheDocument();
  });

  it("redirects to join page if current player doesn't exist", () => {
    renderManager({
      isInGame: true,
      gameInfo: gameInfoFixture({ players: [] }),
    });

    expect(screen.getByText(/^Join game$/)).toBeInTheDocument();
  });

  it("displays waiting room if game is not in progress", () => {
    renderManager({
      isInGame: true,
      gameInfo: gameInfoFixture({
        players: [playerFixture({ userId: CURRENT_PLAYER_ID })],
        isInProgress: false,
      }),
    });

    expect(screen.getByText("Copy invite link")).toBeInTheDocument();
  });

  it("displays game if player is ready", () => {
    renderManager({
      isInGame: true,
      gameInfo: gameInfoFixture({
        isInProgress: true,
        players: [
          playerFixture({
            userId: CURRENT_PLAYER_ID,
            status: PlayerStatus.READY,
          }),
        ],
      }),
    });

    expect(screen.getByText(/^GAME$/)).toBeInTheDocument();
  });

  it("displays spectator view if player is not in game", () => {
    renderManager({
      isInGame: true,
      gameInfo: gameInfoFixture({
        isInProgress: true,
        players: [
          playerFixture({
            userId: CURRENT_PLAYER_ID,
            status: PlayerStatus.SPECTATING,
          }),
        ],
      }),
    });

    expect(screen.getByText("Spectator view")).toBeInTheDocument();
  });
});
