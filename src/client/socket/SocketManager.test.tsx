import { ServerToClientEventName } from "../../types/socket";
import { renderComponent } from "../testUtils";
import SocketManager from "./SocketManager";
import { socket } from ".";

const mockSocketOn = socket.on as jest.Mock;

const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
  useToast: () => mockToast,
}));

describe("<SocketManager />", () => {
  it("disconnects from socket when component unmounts", () => {
    const { unmount } = renderComponent(<SocketManager />);

    expect(socket.disconnect).not.toHaveBeenCalled();
    unmount();

    expect(socket.disconnect).toHaveBeenCalledWith();
  });

  it("subscribes to notifications on mount", () => {
    renderComponent(<SocketManager />);

    expect(mockSocketOn).toHaveBeenCalledWith(
      ServerToClientEventName.Notification,
      expect.any(Function),
    );
  });

  it("emits a toast event whenever a notification is received", () => {
    const message = "Hello world";

    renderComponent(<SocketManager />);

    mockSocketOn.mock.calls[0][1]({ message });

    expect(mockToast).toHaveBeenCalledWith({ description: message });
  });

  it("unsubscribes from notifications on unmount", () => {
    const { unmount } = renderComponent(<SocketManager />);

    expect(socket.off).not.toHaveBeenCalled();
    unmount();

    expect(socket.off).toHaveBeenCalledWith(
      ServerToClientEventName.Notification,
    );
  });
});
