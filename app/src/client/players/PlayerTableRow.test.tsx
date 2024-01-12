import { Table, Tbody } from "@chakra-ui/react";
import { screen, waitFor, within } from "@testing-library/react";
import PlayerTableRow, { PlayerTableRowProps } from "./PlayerTableRow";
import { playerFixture } from "@/client/fixtures/player";
import { socket } from "@/client/socket";
import { CURRENT_PLAYER_ID, renderComponent } from "@/client/testUtils";
import { Player, PlayerStatus } from "@/types/player";

const WITHOUT_KICK_COLUMN_COUNT = 3;

const STATUS_COLUMN_INDEX = 0;
const PLAYER_COLUMN_INDEX = 1;
const GAMES_WON_COLUMN_INDEX = 2;
const KICK_COLUMN_INDEX = 3;

const mockEmit = socket.emit as jest.Mock;

function renderRow({
  isCurrentPlayerAdmin = false,
  player = playerFixture(),
  playerCount = 1,
}: Partial<PlayerTableRowProps> = {}) {
  return renderComponent(
    <Table>
      <Tbody>
        <PlayerTableRow
          isCurrentPlayerAdmin={isCurrentPlayerAdmin}
          player={player}
          playerCount={playerCount}
        />
      </Tbody>
    </Table>,
  );
}

describe("<PlayerTableRow />", () => {
  function getRowCells() {
    return screen.getAllByRole("cell");
  }

  describe("status column", () => {
    describe("current player button group", () => {
      it.each([
        [PlayerStatus.NOT_READY, "Set status as not ready"],
        [PlayerStatus.SPECTATING, "Set status as spectating"],
        [PlayerStatus.READY, "Set status as ready"],
      ])("emits setStatus event on %s click", async (status, label) => {
        const { user } = renderRow({
          player: playerFixture({ userId: CURRENT_PLAYER_ID, status }),
        });

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
      renderRow({ player: playerFixture({ status }) });

      expect(getRowCells()[STATUS_COLUMN_INDEX]).toHaveTextContent(
        new RegExp(`^${text}$`),
      );
    });
  });

  describe("player column", () => {
    it("renders player username", () => {
      const username = "player-name";

      renderRow({ player: playerFixture({ username }) });

      expect(getRowCells()[PLAYER_COLUMN_INDEX]).toHaveTextContent(
        new RegExp(`^${username}$`),
      );
    });

    describe("admin icon", () => {
      it("renders key icon for admin", () => {
        renderRow({ player: playerFixture({ isAdmin: true }) });

        expect(
          within(getRowCells()[PLAYER_COLUMN_INDEX]).getByLabelText("Admin"),
        ).toBeInTheDocument();
      });

      it("does not render key icon for non-admin", () => {
        renderRow({ player: playerFixture({ isAdmin: false }) });

        expect(
          within(getRowCells()[PLAYER_COLUMN_INDEX]).queryByLabelText("Admin"),
        ).not.toBeInTheDocument();
      });
    });

    describe("winner icon", () => {
      it("renders crown icon for previous winner", () => {
        renderRow({ player: playerFixture({ isTopBanana: true }) });

        expect(
          within(getRowCells()[PLAYER_COLUMN_INDEX]).getByLabelText(
            "Previous round winner",
          ),
        ).toBeInTheDocument();
      });

      it("does not render crown icon for loser", () => {
        renderRow({ player: playerFixture({ isTopBanana: false }) });

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

    renderRow({ player: playerFixture({ gamesWon }) });

    expect(getRowCells()[GAMES_WON_COLUMN_INDEX]).toHaveTextContent(
      `${gamesWon}`,
    );
  });

  describe("kick column", () => {
    it("is not rendered if more than one player but current player is not admin", () => {
      renderRow({ playerCount: 2, isCurrentPlayerAdmin: false });

      expect(getRowCells()).toHaveLength(WITHOUT_KICK_COLUMN_COUNT);
    });

    it("is not rendered if there is only one player in the game but the player is an admin", () => {
      renderRow({ isCurrentPlayerAdmin: true, playerCount: 1 });

      expect(getRowCells()).toHaveLength(WITHOUT_KICK_COLUMN_COUNT);
    });

    describe("when current player is admin and there is more than one player", () => {
      const otherUserId = "otherUserId";

      function renderRowForAdmin(player: Player) {
        return renderRow({
          player,
          isCurrentPlayerAdmin: true,
          playerCount: 2,
        });
      }

      it("renders empty cell for current player", () => {
        renderRowForAdmin(playerFixture({ userId: CURRENT_PLAYER_ID }));

        expect(getRowCells()[KICK_COLUMN_INDEX]).toHaveTextContent(/^$/);
      });

      it("kicks player on button click", async () => {
        const { user } = renderRowForAdmin(
          playerFixture({ userId: otherUserId }),
        );

        await user.click(
          within(getRowCells()[KICK_COLUMN_INDEX]).getByRole("button"),
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
