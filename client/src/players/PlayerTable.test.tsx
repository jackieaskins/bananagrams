import { screen, waitFor, within } from "@testing-library/react";
import { gameInfoFixture } from "../fixtures/game";
import { playerFixture } from "../fixtures/player";
import { useGame } from "../games/GameContext";
import { render } from "../testUtils";
import PlayerTable from "./PlayerTable";
import { PlayerStatus } from "./types";

const CURRENT_PLAYER_ID = "current-player";

const WITH_KICK_COLUMN_COUNT = 4;
const WITHOUT_KICK_COLUMN_COUNT = 3;

const STATUS_COLUMN_INDEX = 0;
const PLAYER_COLUMN_INDEX = 1;
const GAMES_WON_COLUMN_INDEX = 2;
const KICK_COLUMN_INDEX = 3;

const mockEmit = jest.fn();
jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: {
      id: CURRENT_PLAYER_ID,
      emit: mockEmit,
    },
  }),
}));

const mockUseGame = useGame as jest.Mock;
jest.mock("../games/GameContext", () => ({
  ...jest.requireActual("../games/GameContext"),
  useGame: jest.fn(),
}));

function renderTable(players = [playerFixture({ userId: CURRENT_PLAYER_ID })]) {
  mockUseGame.mockReturnValue({ gameInfo: gameInfoFixture({ players }) });
  return render(<PlayerTable />);
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

  describe("table rows", () => {
    function getRowCells(row: number = 0) {
      return within(screen.getAllByRole("row")[row + 1]).getAllByRole("cell");
    }

    describe("status column", () => {
      describe("current player button group", () => {
        it.each([
          [PlayerStatus.NOT_READY, "Set status as not ready"],
          [PlayerStatus.SPECTATING, "Set status as spectating"],
          [PlayerStatus.READY, "Set status as ready"],
        ])("emits setStatus event on %s click", async (status, label) => {
          const { user } = renderTable([
            playerFixture({ userId: CURRENT_PLAYER_ID, status }),
          ]);

          await user.click(
            within(getRowCells()[STATUS_COLUMN_INDEX]).getByLabelText(label),
          );

          await waitFor(() => {
            expect(mockEmit).toHaveBeenCalledWith("setStatus", { status });
          });
        });
      });

      it.each([
        [PlayerStatus.NOT_READY, "Not ready"],
        [PlayerStatus.SPECTATING, "Spectating"],
        [PlayerStatus.READY, "Ready"],
      ])("renders %s status text for other players", (status, text) => {
        renderTable([playerFixture({ status })]);

        expect(getRowCells()[STATUS_COLUMN_INDEX]).toHaveTextContent(
          new RegExp(`^${text}$`),
        );
      });
    });

    describe("player column", () => {
      it("renders player username", () => {
        const username = "player-name";

        renderTable([playerFixture({ username })]);

        expect(getRowCells()[PLAYER_COLUMN_INDEX]).toHaveTextContent(
          new RegExp(`^${username}$`),
        );
      });

      describe("admin icon", () => {
        it("renders key icon for admin", () => {
          renderTable([playerFixture({ isAdmin: true })]);

          expect(
            within(getRowCells()[PLAYER_COLUMN_INDEX]).getByLabelText("Admin"),
          ).toBeInTheDocument();
        });

        it("does not render key icon for non-admin", () => {
          renderTable([playerFixture({ isAdmin: false })]);

          expect(
            within(getRowCells()[PLAYER_COLUMN_INDEX]).queryByLabelText(
              "Admin",
            ),
          ).not.toBeInTheDocument();
        });
      });

      describe("winner icon", () => {
        it("renders crown icon for previous winner", () => {
          renderTable([playerFixture({ isTopBanana: true })]);

          expect(
            within(getRowCells()[PLAYER_COLUMN_INDEX]).getByLabelText(
              "Previous round winner",
            ),
          ).toBeInTheDocument();
        });

        it("does not render crown icon for loser", () => {
          renderTable([playerFixture({ isTopBanana: false })]);

          expect(
            within(getRowCells()[PLAYER_COLUMN_INDEX]).queryByLabelText(
              "Previous round winner",
            ),
          ).not.toBeInTheDocument();
        });
      });
    });

    it("renders games won column", () => {
      const gamesWon = 25;

      renderTable([playerFixture({ gamesWon })]);

      expect(getRowCells()[GAMES_WON_COLUMN_INDEX]).toHaveTextContent(
        `${gamesWon}`,
      );
    });

    describe("kick column", () => {
      it("is not rendered if more than one player but current player is not admin", () => {
        renderTable([
          playerFixture({ userId: CURRENT_PLAYER_ID, isAdmin: false }),
          playerFixture({ isAdmin: false }),
        ]);

        expect(getRowCells(0)).toHaveLength(WITHOUT_KICK_COLUMN_COUNT);
        expect(getRowCells(1)).toHaveLength(WITHOUT_KICK_COLUMN_COUNT);
      });

      it("is not rendered if there is only one player in the game but the player is an admin", () => {
        renderTable([
          playerFixture({ userId: CURRENT_PLAYER_ID, isAdmin: true }),
        ]);

        expect(getRowCells(0)).toHaveLength(WITHOUT_KICK_COLUMN_COUNT);
      });

      describe("when current player is admin and there is more than one player", () => {
        const otherUserId = "otherUserId";

        function renderTableForAdmin() {
          return renderTable([
            playerFixture({ userId: CURRENT_PLAYER_ID, isAdmin: true }),
            playerFixture({ userId: otherUserId, isAdmin: false }),
          ]);
        }

        it("renders empty cell for current player", () => {
          renderTableForAdmin();

          expect(getRowCells(0)[KICK_COLUMN_INDEX]).toHaveTextContent(/^$/);
        });

        it("kicks player on button click", async () => {
          const { user } = renderTableForAdmin();

          await user.click(
            within(getRowCells(1)[KICK_COLUMN_INDEX]).getByRole("button"),
          );

          await waitFor(() => {
            expect(mockEmit).toHaveBeenCalledWith("kickPlayer", {
              userId: otherUserId,
            });
          });
        });
      });
    });
  });
});
