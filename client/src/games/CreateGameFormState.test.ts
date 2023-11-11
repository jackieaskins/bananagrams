import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCreateGameForm } from "./CreateGameFormState";

jest.mock("react", () => ({
  useState: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: () => mockNavigate,
}));

const mockEmit = jest.fn();
jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: {
      emit: mockEmit,
    },
  }),
}));

describe("useCreateGameForm", () => {
  const mockSetGameName = jest.fn().mockName("setGameName");
  const mockSetUsername = jest.fn().mockName("setUsername");
  const mockSetError = jest.fn().mockName("setError");
  const mockSetIsCreatingGame = jest.fn().mockName("setIsCreatingGame");

  beforeEach(() => {
    useLocation.mockReturnValue({
      search: "",
    });
    useState
      .mockImplementationOnce((initialValue) => [initialValue, mockSetGameName])
      .mockImplementationOnce((initialValue) => [initialValue, mockSetUsername])
      .mockImplementationOnce((initialValue) => [initialValue, mockSetError])
      .mockImplementationOnce((initialValue) => [
        initialValue,
        mockSetIsCreatingGame,
      ]);
  });

  test("has correct default state", () => {
    expect(useCreateGameForm()).toMatchSnapshot();
  });

  describe("onSubmit", () => {
    const event = { preventDefault: jest.fn() };

    test("prevents default event", () => {
      useCreateGameForm().onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalledWith();
    });

    test("sets is creating game", () => {
      useCreateGameForm().onSubmit(event);

      expect(mockSetIsCreatingGame).toHaveBeenCalledWith(true);
    });

    test("emits create game event to socket", () => {
      useCreateGameForm().onSubmit(event);

      expect(mockEmit).toHaveBeenCalledWith(
        "createGame",
        { gameName: "", username: "", isShortenedGame: false },
        expect.any(Function),
      );
    });

    test("creates shortened game if query param is present", () => {
      useLocation.mockReturnValue({ search: "?isShortenedGame=true" });
      useCreateGameForm().onSubmit(event);

      expect(mockEmit.mock.calls[0][1]).toEqual({
        gameName: "",
        username: "",
        isShortenedGame: true,
      });
    });

    describe("socket createGame callback", () => {
      beforeEach(() => {
        useCreateGameForm().onSubmit(event);
      });

      describe("on error", () => {
        beforeEach(() => {
          mockEmit.mock.calls[0][2](new Error("error"), {});
        });

        test("sets error in state", () => {
          expect(mockSetError).toHaveBeenCalledWith("error");
        });

        test("sets is creating game to false", () => {
          expect(mockSetIsCreatingGame).toHaveBeenCalledWith(false);
        });
      });

      describe("on success", () => {
        const gameInfo = { gameId: "gameId" };

        beforeEach(() => {
          mockEmit.mock.calls[0][2](null, gameInfo);
        });

        test("redirects to game with state", () => {
          expect(mockNavigate).toHaveBeenCalledWith("/game/gameId", {
            state: { isInGame: true, gameInfo },
          });
        });
      });
    });
  });
});
