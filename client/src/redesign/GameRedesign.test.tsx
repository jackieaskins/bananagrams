import Konva from "konva";
import { playerFixture } from "../fixtures/player";
import { renderComponent } from "../testUtils";
import GameRedesign from "./GameRedesign";

jest.mock("./useCurrentPlayer", () => ({
  useCurrentPlayer: () =>
    playerFixture({
      hand: [
        { id: "A1", letter: "A" },
        { id: "B1", letter: "B" },
      ],
    }),
}));

describe("<GameRedesign />", () => {
  it("renders canvas", () => {
    renderComponent(<GameRedesign />);

    expect(Konva.stages).toHaveLength(1);
  });
});
