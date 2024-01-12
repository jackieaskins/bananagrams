import { shallow } from "enzyme";
import Game from "./Game";
import { useGame } from "./GameContext";
import { playerFixture } from "@/client/fixtures/player";
import { CURRENT_PLAYER_ID } from "@/client/testUtils";
import { PlayerStatus } from "@/types/player";

const mockUseGame = useGame as jest.Mock;
jest.mock("./GameContext", () => ({
  useGame: jest.fn(),
}));

jest.mock("../boards/validate", () => ({
  isValidConnectedBoard: () => false,
}));

describe("<Game />", () => {
  const renderComponent = () => shallow(<Game />);

  beforeEach(() => {
    mockUseGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [playerFixture({ userId: CURRENT_PLAYER_ID })],
      },
      handlePeel: jest.fn().mockName("handlePeel"),
    });
  });

  test("renders properly", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it("renders properly with more than one active player", () => {
    mockUseGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [
          playerFixture({
            userId: CURRENT_PLAYER_ID,
            status: PlayerStatus.READY,
          }),
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
