import { shallow } from "enzyme";
import { playerFixture } from "../fixtures/player";
import { Player, PlayerStatus } from "../players/types";
import { useGame } from "./GameContext";
import GameManager from "./GameManager";

const CURRENT_PLAYER_ID = "current";

jest.mock("./GameContext", () => ({
  useGame: jest.fn(),
}));

jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: {
      id: CURRENT_PLAYER_ID,
    },
  }),
}));

describe("<GameManager />", () => {
  const mockUseGame = (
    isInGame: boolean,
    isInProgress: boolean,
    players: Player[] = [playerFixture({ userId: CURRENT_PLAYER_ID })],
  ) => {
    useGame.mockReturnValue({
      gameInfo: { gameId: "gameId", isInProgress, players },
      isInGame,
    });
  };

  const renderComponent = () => shallow(<GameManager />);

  it("renders redirect when not in game", () => {
    mockUseGame(false, false);

    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders redirect when no current player", () => {
    mockUseGame(false, false, [playerFixture({ userId: "some-other-id" })]);

    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders WaitingRoom when in game but game hasn't started", () => {
    mockUseGame(true, false);

    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders Game when in game, game is in progress, and status is ready", () => {
    mockUseGame(true, true, [
      playerFixture({ userId: CURRENT_PLAYER_ID, status: PlayerStatus.READY }),
    ]);

    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders SpectatorView when in game, game is in progress, and status is not ready", () => {
    mockUseGame(true, true, [
      playerFixture({
        userId: CURRENT_PLAYER_ID,
        status: PlayerStatus.SPECTATING,
      }),
    ]);

    expect(renderComponent()).toMatchSnapshot();
  });
});
