import { shallow } from "enzyme";
import { playerFixture } from "../fixtures/player";
import { PlayerStatus } from "../players/types";
import Game from "./Game";
import { useGame } from "./GameContext";

jest.mock("./GameContext", () => ({
  useGame: jest.fn(),
}));

jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: { id: "id" },
  }),
}));

jest.mock("../boards/validate", () => ({
  isValidConnectedBoard: () => false,
}));

describe("<Game />", () => {
  const renderComponent = () => shallow(<Game />);

  beforeEach(() => {
    useGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [playerFixture({ userId: "id" })],
      },
      handlePeel: jest.fn().mockName("handlePeel"),
    });
  });

  test("renders properly", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders properly with more than one active player", () => {
    useGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [
          playerFixture({ userId: "id", status: PlayerStatus.READY }),
          playerFixture({
            userId: "inactive",
            status: PlayerStatus.SPECTATING,
          }),
          playerFixture({ userId: "other", status: PlayerStatus.READY }),
        ],
      },
      handlePeel: jest.fn().mockName("handlePeel"),
    });

    expect(renderComponent()).toMatchSnapshot();
  });
});
