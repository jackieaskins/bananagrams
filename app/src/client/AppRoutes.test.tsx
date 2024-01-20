import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import LocalStorageProvider from "./LocalStorageProvider";
import { gameInfoFixture } from "./fixtures/game";
import { playerFixture } from "./fixtures/player";
import { CURRENT_PLAYER_ID, renderComponent } from "./testUtils";

const gameName = "GAME_NAME";
const mockPlayer = playerFixture({ userId: CURRENT_PLAYER_ID });

jest.mock("@/client/games/GameContext", () => ({
  ...jest.requireActual("@/client/games/GameContext"),
  useGame: () => ({
    isInGame: true,
    gameInfo: gameInfoFixture({ gameName, players: [mockPlayer] }),
  }),
}));

const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn((val, { fallback }) => val[fallback]),
  useToast: () => mockToast,
}));

function renderRoutes(path: string) {
  return renderComponent(
    <LocalStorageProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </LocalStorageProvider>,
  );
}

describe("<AppRoutes />", () => {
  // TODO: Figure out how to test the number of routes so this breaks when new routes are added
  it.each([
    ["home", "/", "Start a new game"],
    ["game", "/game/123", gameName],
    ["join game", "/game/123/join", "Join game"],
    ["tutorial", "/tutorial", "Welcome to Bananagrams!"],
    ["changelog", "/changelog", "Changelog"],
    ["not found", "/random-route", "404: Page Not Found"],
  ])("renders %s route for %s", (_, path, expectedText) => {
    renderRoutes(path);

    expect(screen.getAllByText(expectedText).length).toBeGreaterThanOrEqual(1);
  });
});
