import { screen } from "@testing-library/react";
import { gameInfoFixture } from "../fixtures/game";
import { playerFixture } from "../fixtures/player";
import { useGame } from "../games/GameContext";
import { renderComponent } from "../testUtils";
import PlayerTable from "./PlayerTable";

const CURRENT_PLAYER_ID = "current-player";

const WITH_KICK_COLUMN_COUNT = 4;
const WITHOUT_KICK_COLUMN_COUNT = 3;

const STATUS_COLUMN_INDEX = 0;
const PLAYER_COLUMN_INDEX = 1;
const GAMES_WON_COLUMN_INDEX = 2;
const KICK_COLUMN_INDEX = 3;

jest.mock("./PlayerTableRow", () => jest.fn(() => <tr />));

jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: { id: CURRENT_PLAYER_ID },
  }),
}));

const mockUseGame = useGame as jest.Mock;
jest.mock("../games/GameContext", () => ({
  ...jest.requireActual("../games/GameContext"),
  useGame: jest.fn(),
}));

function renderTable(players = [playerFixture({ userId: CURRENT_PLAYER_ID })]) {
  mockUseGame.mockReturnValue({ gameInfo: gameInfoFixture({ players }) });
  return renderComponent(<PlayerTable />);
}

describe("<PlayerTable />", () => {
  it("renders current player count caption", () => {
    renderTable();

    expect(screen.getByRole("table")).toHaveTextContent(
      "Current player count: 1/16 max",
    );
  });

  describe("table header", () => {
    function getAllHeaders() {
      return screen.getAllByRole("columnheader");
    }

    it("renders status column header", () => {
      renderTable();

      expect(getAllHeaders()[STATUS_COLUMN_INDEX]).toHaveTextContent(
        /^Status$/,
      );
    });

    it("renders player column header", () => {
      renderTable();

      expect(getAllHeaders()[PLAYER_COLUMN_INDEX]).toHaveTextContent(
        /^Player$/,
      );
    });

    it("renders games won column header", () => {
      renderTable();

      expect(getAllHeaders()[GAMES_WON_COLUMN_INDEX]).toHaveTextContent(
        /^Games won$/,
      );
    });

    it("renders empty kick column header when admin", () => {
      renderTable([
        playerFixture({ userId: CURRENT_PLAYER_ID, isAdmin: true }),
        playerFixture(),
      ]);

      expect(getAllHeaders()[KICK_COLUMN_INDEX]).toHaveTextContent(/^$/);
      expect(getAllHeaders()).toHaveLength(WITH_KICK_COLUMN_COUNT);
    });

    it("does not render empty kick column header when not admin", () => {
      renderTable([
        playerFixture({ userId: CURRENT_PLAYER_ID, isAdmin: false }),
        playerFixture(),
      ]);

      expect(getAllHeaders()).toHaveLength(WITHOUT_KICK_COLUMN_COUNT);
    });
  });

  it("renders a row for each player", () => {
    const players = [playerFixture(), playerFixture()];
    renderTable(players);

    // + 1 for headr row
    expect(screen.getAllByRole("row")).toHaveLength(players.length + 1);
  });
});
