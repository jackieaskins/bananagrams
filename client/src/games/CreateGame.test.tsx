import { screen, waitFor } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { gameInfoFixture } from "../fixtures/game";
import { useSavedUsername } from "../localStorage";
import { renderComponent } from "../testUtils";
import CreateGame from "./CreateGame";
import { GameInfo } from "./types";

const GAME_ID = "GAME_ID";
const GAME_SCREEN_TEXT = `game id: ${GAME_ID}`;

const mockSetSavedUsername = jest.fn();
const mockUseSavedUsername = useSavedUsername as jest.Mock;
jest.mock("../localStorage", () => ({
  useSavedUsername: jest.fn(),
}));

const mockEmit = jest.fn();
jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: {
      emit: mockEmit,
    },
  }),
}));

function renderForm(isShortenedGame: boolean = false) {
  return renderComponent(
    <MemoryRouter
      initialEntries={[`/${isShortenedGame ? "?isShortenedGame" : ""}`]}
    >
      <Routes>
        <Route path="/" element={<CreateGame />} />
        <Route path="/game/:gameId" element={<div>{GAME_SCREEN_TEXT}</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function mockEmitCallback(
  error: Error | null,
  gameInfo: GameInfo = gameInfoFixture(),
) {
  mockEmit.mockImplementation((_event, _params, callback) =>
    callback(error, gameInfo),
  );
}

async function submitForm(
  user: UserEvent,
  gameName?: string,
  username?: string,
): Promise<void> {
  if (gameName) {
    await user.type(screen.getByLabelText("Game name*"), gameName);
  }

  if (username) {
    await user.type(screen.getByLabelText("Username*"), username);
  }

  await user.click(screen.getByRole("button"));
}

describe("<CreateGame />", () => {
  beforeEach(() => {
    mockUseSavedUsername.mockReturnValue(["", mockSetSavedUsername]);
  });

  it("defaults username field to saved username", () => {
    const defaultUsername = "default";
    mockUseSavedUsername.mockReturnValue([defaultUsername, jest.fn()]);

    renderForm();

    expect(screen.getByLabelText("Username*")).toHaveValue(defaultUsername);
  });

  it("does not submit the form if game name is not provided", async () => {
    const { user } = renderForm();

    await submitForm(user, undefined, "username");

    await waitFor(() => {
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  it("does not submit the form if username is not provided", async () => {
    const { user } = renderForm();

    await submitForm(user, "gameName", undefined);

    await waitFor(() => {
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  it("updates saved username", async () => {
    const { user } = renderForm();
    const username = "username";

    await submitForm(user, "gameName", username);

    await waitFor(() => {
      expect(mockSetSavedUsername).toHaveBeenCalledWith(username);
    });
  });

  it("creates non-shortened game", async () => {
    const username = "username";
    const gameName = "gameName";
    const { user } = renderForm();

    await submitForm(user, gameName, username);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        "createGame",
        { gameName, username, isShortenedGame: false },
        expect.any(Function),
      );
    });
  });

  it("creates shortened game", async () => {
    const username = "username";
    const gameName = "gameName";
    const { user } = renderForm(true);

    await submitForm(user, gameName, username);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        "createGame",
        { gameName, username, isShortenedGame: true },
        expect.any(Function),
      );
    });
  });

  it("redirects to game with state after successful submit", async () => {
    mockEmitCallback(null);
    const { user } = renderForm();

    await submitForm(user, "gameName", "username");

    await waitFor(() => {
      expect(screen.getByText(GAME_SCREEN_TEXT)).toBeInTheDocument();
    });
  });

  it("shows an error if there was an error submitting the form", async () => {
    const errorMessage = "Here is the error";
    mockEmitCallback(new Error(errorMessage));
    const { user } = renderForm();

    await submitForm(user, "gameName", "username");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        new RegExp(`^${errorMessage}$`),
      );
    });
  });
});
