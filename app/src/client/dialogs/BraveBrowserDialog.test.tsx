import { act, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import BraveBrowserDialog from "./BraveBrowserDialog";
import { renderComponent } from "@/client/testUtils";

const MAIN_ROUTE = "/";
const OTHER_ROUTE = "/other-page";

jest.mock("../env", () => ({
  PROD: true,
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

function renderDialog(pathname: string) {
  return renderComponent(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route
          path={MAIN_ROUTE}
          element={
            <>
              Main redesign <Link to={OTHER_ROUTE}>Other</Link>
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
    renderDialog(MAIN_ROUTE);

    await assertDialogInDocument();
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
