import { screen } from "@testing-library/react";
import Konva from "konva";
import { gameInfoFixture } from "../fixtures/game";
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

jest.mock("../games/GameContext", () => ({
  ...jest.requireActual("../games/GameContext"),
  useGame: () => ({
    gameInfo: gameInfoFixture({
      bunch: [
        { id: "A1", letter: "A" },
        { id: "B1", letter: "B" },
      ],
    }),
  }),
}));

function renderGame() {
  return renderComponent(<GameRedesign />);
}

describe("<GameRedesign />", () => {
  it("renders canvas", () => {
    renderGame();

    expect(Konva.stages).toHaveLength(1);
  });

  it("renders peel button", () => {
    renderGame();

    expect(screen.getByRole("button", { name: "Peel!" })).toBeInTheDocument();
  });

  it("renders shuffle hand button", () => {
    renderGame();

    expect(
      screen.getByRole("button", { name: "Shuffle hand" }),
    ).toBeInTheDocument();
  });

  it("renders spectate button", () => {
    renderGame();

    expect(
      screen.getByRole("button", { name: "Switch to spectator" }),
    ).toBeInTheDocument();
  });

  it("displays bunch count", () => {
    renderGame();

    expect(screen.getByText("Bunch: 2 tiles")).toBeInTheDocument();
  });
});
