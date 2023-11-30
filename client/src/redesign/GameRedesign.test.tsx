import { screen } from "@testing-library/react";
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

  it("renders game sidebar", () => {
    renderComponent(<GameRedesign />);

    expect(screen.getByLabelText("Expand game sidebar")).toBeInTheDocument();
  });
});
