import { screen, waitFor } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { render } from "../testUtils";
import { getEmptyGameInfo } from "./GameContext";
import JoinGameForm from "./JoinGameForm";
import { GameInfo } from "./types";

const GAME_ID = "GAME_ID";
const GAME_SCREEN_TEXT = `game id: ${GAME_ID}`;

const mockEmit = jest.fn();
jest.mock("../socket/SocketContext", () => ({
  useSocket: () => ({
    socket: {
      emit: mockEmit,
    },
  }),
}));

function renderForm() {
  return render(
    <MemoryRouter initialEntries={[`/game/${GAME_ID}/join`]} initialIndex={0}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/game/:gameId/join" element={<JoinGameForm />} />
        <Route path="/game/:gameId" element={<div>{GAME_SCREEN_TEXT}</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function mockEmitCallback(
  error: Error | null,
  gameInfo: GameInfo = getEmptyGameInfo(GAME_ID),
) {
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

describe("<JoinGameForm />", () => {
  it("does not submit the form is username is not provided", async () => {
    const { user } = renderForm();

    await submitForm(user, undefined, undefined);

    await waitFor(() => {
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  it("joins game when spectator is not selected", async () => {
    const username = "username";
    const { user } = renderForm();

    submitForm(user, username);

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
    mockEmitCallback(null);
    const { user } = renderForm();

    await submitForm(user, "username");

    await waitFor(() => {
      expect(screen.getByText(GAME_SCREEN_TEXT)).toBeInTheDocument();
    });
  });

  it("shows an error if there was en error submitting the form", async () => {
    const errorMessage = "Here is the error";
    mockEmitCallback(new Error(errorMessage));
    const { user } = renderForm();

    await submitForm(user, "username");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        new RegExp(`^${errorMessage}$`),
      );
    });
  });

  it("returns to the homepage when home link is clicked", async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole("link"));

    await waitFor(() => {
      expect(screen.getByText(/^Home$/)).toBeInTheDocument();
    });
  });
});
