import { screen } from "@testing-library/react";
import { renderComponent } from "../testUtils";
import GameSidebar from "./GameSidebar";

describe("<GameSidebar />", () => {
  it("renders sidebar button", () => {
    renderComponent(<GameSidebar />);

    expect(screen.getByLabelText("Expand game sidebar")).toBeInTheDocument();
  });
});
