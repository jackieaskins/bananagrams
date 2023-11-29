import { screen } from "@testing-library/react";
import Konva from "konva";
import { renderComponent } from "../testUtils";
import GameRedesign from "./GameRedesign";

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
