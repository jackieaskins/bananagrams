import { act, renderHook } from "@testing-library/react";
import { useEnableTileSwap } from "./localStorage";

describe("localStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe("useEnableTileSwap", () => {
    it("returns false if not set", () => {
      const { result } = renderHook(useEnableTileSwap);

      expect(result.current[0]).toBe(false);
    });

    it("returns value stored in local storage", () => {
      localStorage.setItem("bananagrams.gameSettings.enableTileSwap", "true");

      const { result } = renderHook(useEnableTileSwap);

      expect(result.current[0]).toBe(true);
    });

    it("updates value in local storage", () => {
      const { result } = renderHook(useEnableTileSwap);

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
      expect(
        localStorage.getItem("bananagrams.gameSettings.enableTileSwap"),
      ).toBe("true");
    });

    it("returns default value when invalid item is in local storage", () => {
      localStorage.setItem(
        "bananagrams.gameSettings.enableTileSwap",
        "invalid",
      );

      const { result } = renderHook(useEnableTileSwap);

      expect(result.current[0]).toBe(false);
    });
  });
});
