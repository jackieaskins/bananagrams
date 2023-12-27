import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { socket } from "../socket";
import { renderComponent } from "../testUtils";
import ServerDisconnectDialog from "./ServerDisconnectDialog";

const mockOn = socket.on as jest.Mock;

function emitDisconnect() {
  mockOn.mockImplementation((_event, callback) => callback());
}

function renderDialog(pathname: string = "/not-redesign") {
  return renderComponent(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path={pathname} element="Current page" />
        <Route path="/" element="Home" />
        <Route path="/redesign" element="Redesigned home" />
      </Routes>
      <ServerDisconnectDialog />
    </MemoryRouter>,
  );
}

describe("<ServerDisconnectDialog />", () => {
  it("does not show by default", () => {
    renderDialog();

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("is rendered when a disconnect event is triggered", () => {
    emitDisconnect();
    renderDialog();

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("redirects to home when return home is clicked", async () => {
    emitDisconnect();
    const { user } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Return home" }));

    await waitFor(() => {
      expect(window.location).toBeAt("/");
    });
  });

  it("redirects to redesign when return home is clicked", async () => {
    emitDisconnect();
    const { user } = renderDialog("/redesign/other-route");

    await user.click(screen.getByRole("button", { name: "Return home" }));

    await waitFor(() => {
      expect(window.location).toBeAt("/redesign");
    });
  });
});
