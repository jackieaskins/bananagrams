import { act, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import BraveBrowserDialog from "./BraveBrowserDialog";
import { useShowBravePrompt } from "@/client/LocalStorageContext";
import { renderComponent } from "@/client/testUtils";

const MAIN_ROUTE = "/";
const OTHER_ROUTE = "/other-page";

const mockSetShowBravePrompt = jest.fn();
const mockUseShowBravePrompt = useShowBravePrompt as jest.Mock;
jest.mock("@/client/LocalStorageContext", () => ({
  useShowBravePrompt: jest.fn(),
}));

async function assertDialogNotInDocument() {
  await waitFor(() => {
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
}

async function assertDialogInDocument() {
  await waitFor(() => {
    expect(
      screen.getByRole("alertdialog", { name: "Brave Browser Detected" }),
    ).toBeInTheDocument();
  });
}

function renderDialog(pathname: string, shouldShow = true) {
  mockUseShowBravePrompt.mockReturnValue([shouldShow, mockSetShowBravePrompt]);

  return renderComponent(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route
          path={MAIN_ROUTE}
          element={
            <>
              Main route <Link to={OTHER_ROUTE}>Other</Link>
            </>
          }
        />
        <Route path={OTHER_ROUTE} element="Other route" />
      </Routes>
      <BraveBrowserDialog />
    </MemoryRouter>,
  );
}

function mockBrave(isBrave = false) {
  // @ts-expect-error brave object is included on navigator in Brave Browser
  window.navigator.brave = isBrave
    ? { isBrave: jest.fn().mockResolvedValue(true) }
    : undefined;
}

describe("<BraveBrowserDialog />", () => {
  let windowNavigator: Navigator;

  beforeEach(() => {
    windowNavigator = window.navigator;
    mockBrave();
  });

  afterEach(() => {
    window.navigator = windowNavigator;
  });

  it("does not render when not in brave", async () => {
    renderDialog(MAIN_ROUTE);

    await assertDialogNotInDocument();
  });

  it("renders when in brave", async () => {
    mockBrave(true);
    renderDialog(MAIN_ROUTE, true);

    await assertDialogInDocument();
  });

  it("does not render when dont show is set in local storage", async () => {
    mockBrave(true);
    renderDialog(MAIN_ROUTE, false);

    await assertDialogNotInDocument();
  });

  it("updates local storage on close when checkbox is selected", async () => {
    mockBrave(true);
    const { user } = renderDialog(MAIN_ROUTE, true);

    await assertDialogInDocument();

    await act(async () => {
      await user.click(screen.getByLabelText("Don't show again"));
      await user.click(screen.getByRole("button", { name: "Close" }));
    });

    expect(mockSetShowBravePrompt).toHaveBeenCalledWith(false);
  });

  it("does not render when dialog has been opened before", async () => {
    mockBrave(true);
    const { user } = renderDialog(MAIN_ROUTE);

    await assertDialogInDocument();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Ok" }));
    });

    await assertDialogNotInDocument();

    await act(async () => {
      await user.click(screen.getByRole("link", { name: "Other" }));
    });

    await assertDialogNotInDocument();
  });
});
