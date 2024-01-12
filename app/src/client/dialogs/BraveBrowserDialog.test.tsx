import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BraveBrowserDialog from "./BraveBrowserDialog";
import { renderComponent } from "@/client/testUtils";

function renderDialog(pathname: string) {
  return renderComponent(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path={pathname} element="Current page" />
      </Routes>
      <BraveBrowserDialog />
    </MemoryRouter>,
  );
}

jest.mock("../env", () => ({
  PROD: true,
}));

describe("<BraveBrowserDialog />", () => {
  let windowNavigator: Navigator;

  beforeEach(() => {
    windowNavigator = window.navigator;
  });

  afterEach(() => {
    window.navigator = windowNavigator;
  });

  it("does not render when not in brave", () => {
    renderDialog("/redesign/subroute");

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("does not render on non-redesign routes", () => {
    // @ts-expect-error brave object is included on navigator in Brave Browser
    window.navigator.brave = { isBrave: jest.fn(() => true) };
    renderDialog("/some-other-route");

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders when in brave and on a redesign route", () => {
    // @ts-expect-error brave object is included on navigator in Brave Browser
    window.navigator.brave = { isBrave: jest.fn(() => true) };
    renderDialog("/redesign/subroute");

    expect(
      screen.getByRole("alertdialog", { name: "Brave Browser Detected" }),
    ).toBeInTheDocument();
  });
});
