import { Button, useClipboard } from "@chakra-ui/react";
import { shallow } from "enzyme";
import { playerFixture } from "../fixtures/player";
import { useGame } from "./GameContext";
import StartGame from "./StartGame";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn((fn) => fn()),
}));

jest.mock("./GameContext", () => ({
  useGame: jest.fn(),
}));

const mockToast = jest.fn();
const mockOnCopy = jest.fn();
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useClipboard: jest.fn(),
  useToast: jest.fn(() => mockToast),
}));

describe("<StartGame />", () => {
  const mockUseGame = (previousSnapshot = null) => {
    useGame.mockReturnValue({
      gameInfo: {
        gameName: "gameName",
        previousSnapshot,
      },
    });
  };

  const renderComponent = () => shallow(<StartGame />);

  beforeEach(() => {
    mockUseGame();
    useClipboard.mockReturnValue({ hasCopied: false, onCopy: mockOnCopy });
  });

  test("copies the invite link when the copy button is clicked", () => {
    renderComponent().find(Button).props().onClick();

    expect(mockOnCopy).toHaveBeenCalledWith();
  });

  test("shows a toast message when the invite link is copied", () => {
    useClipboard.mockReturnValue({ hasCopied: true, onCopy: mockOnCopy });

    const component = renderComponent();
    component.update();

    expect(mockToast).toHaveBeenCalledWith({
      description: "Successfully copied invite link to clipboard",
    });
  });

  test("does not show a toast message when invite link has not been copied", () => {
    useClipboard.mockReturnValue({ hasCopied: true, onCopy: mockOnCopy });

    const component = renderComponent();
    component.update();

    expect(mockToast).not.toHaveBeenCalledWith();
  });

  test("does not render board when no snapshot", () => {
    mockUseGame();

    expect(renderComponent()).toMatchSnapshot();
  });

  test("renders game boards when snapshot is present", () => {
    mockUseGame([playerFixture({ userId: "123", isTopBanana: true })]);

    expect(renderComponent()).toMatchSnapshot();
  });
});
