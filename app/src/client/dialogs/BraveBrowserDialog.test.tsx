import { act, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import BraveBrowserDialog from "./BraveBrowserDialog";
import { renderComponent } from "@/client/testUtils";

const NON_REDESIGN_ROUTE = "/some-route";
const MAIN_REDESIGN_ROUTE = "/redesign/main";
const OTHER_REDESIGN_ROUTE = "/redesign/other";

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
        <Route path={NON_REDESIGN_ROUTE} element="Not redesign" />
        <Route
          path={MAIN_REDESIGN_ROUTE}
          element={
            <>
              Main redesign <Link to={OTHER_REDESIGN_ROUTE}>Other</Link>
            </>
          }
        />
        <Route path={OTHER_REDESIGN_ROUTE} element="Other redesign" />
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

  it("does not render on non-redesign routes", async () => {
    mockBrave(true);
    renderDialog(NON_REDESIGN_ROUTE);

    await assertDialogNotInDocument();
  });

  it("does not render when on redesign route but not in brave", async () => {
    renderDialog(MAIN_REDESIGN_ROUTE);

    await assertDialogNotInDocument();
  });

  it("renders when in brave and on a redesign route", async () => {
    mockBrave(true);
    renderDialog(MAIN_REDESIGN_ROUTE);

    await assertDialogInDocument();
  });

  it("does not render when dialog has been opened before", async () => {
    mockBrave(true);
    const { user } = renderDialog(MAIN_REDESIGN_ROUTE);

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
