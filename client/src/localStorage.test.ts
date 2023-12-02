import { act, renderHook } from "@testing-library/react";
import { useEnableTileSwap, useSavedUsername } from "./localStorage";
import { SetState } from "./state/types";

const args: Array<{
  key: string;
  hook: () => [any, SetState<any>];
  defaultVal: any;
  otherVal: any;
}> = [
  {
    key: "bananagrams.gameSettings.enableTileSwap",
    hook: useEnableTileSwap,
    defaultVal: false,
    otherVal: true,
  },
  {
    key: "bananagrams.savedUsername",
    hook: useSavedUsername,
    defaultVal: "",
    otherVal: "username",
  },
];

describe("localStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe.each(args)("$hook", ({ key, hook, defaultVal, otherVal }) => {
    it(`returns ${defaultVal} if not set`, () => {
      const { result } = renderHook(hook);

      expect(result.current[0]).toBe(defaultVal);
    });

    it("returns value stored in local storage", () => {
      localStorage.setItem(key, JSON.stringify(otherVal));

      const { result } = renderHook(hook);

      expect(result.current[0]).toBe(otherVal);
    });

    it("updates value in local storage", () => {
      const { result } = renderHook(hook);

      expect(result.current[0]).toBe(defaultVal);

      act(() => {
        result.current[1](otherVal);
      });

      expect(result.current[0]).toBe(otherVal);
      expect(localStorage.getItem(key)).toBe(JSON.stringify(otherVal));
    });

    it("returns default value when invalid item is in local storage", () => {
      localStorage.setItem(key, "invalid");

      const { result } = renderHook(hook);

      expect(result.current[0]).toBe(defaultVal);
    });
  });
});
