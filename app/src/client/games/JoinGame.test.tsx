import { act, screen, waitFor } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import JoinGame from "./JoinGame";
import { useSavedUsername } from "@/client/LocalStorageContext";
import { gameInfoFixture } from "@/client/fixtures/game";
import { socket } from "@/client/socket";
import { renderComponent } from "@/client/testUtils";
import { Game } from "@/types/game";

const GAME_ID = "GAME_ID";
const GAME_SCREEN_TEXT = `game id: ${GAME_ID}`;
const TUTORIAL_TEXT = "TUTORIAL";

const mockSetSavedUsername = jest.fn();
const mockUseSavedUsername = useSavedUsername as jest.Mock;
jest.mock("../LocalStorageContext", () => ({
  useSavedUsername: jest.fn(),
}));

const mockEmit = socket.emit as jest.Mock;

function renderForm() {
  return renderComponent(
    <MemoryRouter initialEntries={[`/game/${GAME_ID}/join`]}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/game/:gameId/join" element={<JoinGame />} />
        <Route path="/game/:gameId" element={<div>{GAME_SCREEN_TEXT}</div>} />
        <Route path="/tutorial" element={<div>{TUTORIAL_TEXT}</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function mockEmitCallback(error: Error | null, gameInfo: Game | null) {
  mockEmit.mockImplementation((_event, _params, callback) =>
    callback(error, gameInfo),
  );
}

async function submitForm(
  user: UserEvent,
  username?: string,
  isSpectator?: boolean,
): Promise<void> {
  if (username) {
    await user.type(screen.getByLabelText("Username*"), username);
  }

  if (isSpectator) {
    await user.click(screen.getByLabelText("Join as spectator"));
  }

  await user.click(screen.getByRole("button"));
}

describe("<JoinGame />", () => {
  beforeEach(() => {
    mockUseSavedUsername.mockReturnValue(["", mockSetSavedUsername]);
  });

  it("defaults username field to saved username", () => {
    const defaultUsername = "default";
    mockUseSavedUsername.mockReturnValue([defaultUsername, jest.fn()]);

    renderForm();

    expect(screen.getByLabelText("Username*")).toHaveValue(defaultUsername);
  });

  it("does not submit the form if username is not provided", async () => {
    const { user } = renderForm();

    await submitForm(user, undefined, undefined);

    await waitFor(() => {
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  it("updates saved username", async () => {
    const { user } = renderForm();
    const username = "username";

    await submitForm(user, username);

    await waitFor(() => {
      expect(mockSetSavedUsername).toHaveBeenCalledWith(username);
    });
  });

  it("joins game when spectator is not selected", async () => {
    const username = "username";
    const { user } = renderForm();

    await submitForm(user, username);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        "joinGame",
        { gameId: GAME_ID, username, isSpectator: false },
        expect.any(Function),
      );
    });
  });

  it("joins game when spectator is selected", async () => {
    const username = "username";
    const { user } = renderForm();

    await submitForm(user, username, true);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        "joinGame",
        { gameId: GAME_ID, username, isSpectator: true },
        expect.any(Function),
      );
    });
  });

  it("redirects to game with state after successful submit", async () => {
    mockEmitCallback(null, gameInfoFixture({ gameId: GAME_ID }));
    const { user } = renderForm();

    await submitForm(user, "username");

    await waitFor(() => {
      expect(screen.getByText(GAME_SCREEN_TEXT)).toBeInTheDocument();
    });
  });

  it("shows an error if there was an error submitting the form", async () => {
    const errorMessage = "Here is the error";
    mockEmitCallback(new Error(errorMessage), null);
    const { user } = renderForm();

    await submitForm(user, "username");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        new RegExp(`^${errorMessage}$`),
      );
    });
  });

  it("shows default error if form error doesn't have a message", async () => {
    mockEmitCallback(null, null);
    const { user } = renderForm();

    await submitForm(user, "username");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /^Unable to join game$/,
      );
    });
  });

  it("has link to tutorial", async () => {
    const { user } = renderForm();

    await act(async () => {
      await user.click(screen.getByRole("link", { name: "Play tutorial" }));
    });

    await waitFor(() => {
      expect(screen.getByText(TUTORIAL_TEXT)).toBeInTheDocument();
    });
  });

  it("returns to the homepage when home link is clicked", async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole("link", { name: "Go home" }));

    await waitFor(() => {
      expect(screen.getByText(/^Home$/)).toBeInTheDocument();
    });
  });
});
