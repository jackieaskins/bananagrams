import { screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { useEnableTileSwap } from "../localStorage";
import { renderComponent } from "../testUtils";
import GameSettings from "./GameSettings";

const mockUseEnableTileSwap = useEnableTileSwap as jest.Mock;
jest.mock("../localStorage", () => ({
  useEnableTileSwap: jest.fn(),
}));

function renderSettings() {
  return renderComponent(<GameSettings />);
}

function getSwitch() {
  return screen.getByLabelText("Enable tile swap");
}

describe("<GameSettings />", () => {
  beforeEach(() => {
    mockUseEnableTileSwap.mockImplementation(() => useState(false));
  });

  describe("enableTileSwap", () => {
    it("starts with switch turned off if not enabled", () => {
      renderSettings();

      expect(getSwitch()).not.toBeChecked();
    });

    it("starts with switch turned on if enabled", () => {
      mockUseEnableTileSwap.mockImplementation(() => useState(true));

      renderSettings();

      expect(getSwitch()).toBeChecked();
    });

    it("switches between enabled and disabled", async () => {
      mockUseEnableTileSwap.mockImplementation(() => useState(false));

      const { user } = renderSettings();

      await user.click(getSwitch());

      await waitFor(() => {
        expect(getSwitch()).toBeChecked();
      });

      await user.click(getSwitch());

      await waitFor(() => {
        expect(getSwitch()).not.toBeChecked();
      });
    });
  });
});
