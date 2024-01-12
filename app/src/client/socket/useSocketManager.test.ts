import { renderHook } from "@testing-library/react";
import useSocketManager from "./useSocketManager";
import { socket } from ".";
import { ServerToClientEventName } from "@/types/socket";

const mockSocketOn = socket.on as jest.Mock;

const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
  useToast: () => mockToast,
}));

describe("useSocketManager", () => {
  it("subscribes to notifications on mount", () => {
    renderHook(useSocketManager);

    expect(mockSocketOn).toHaveBeenCalledWith(
      ServerToClientEventName.Notification,
      expect.any(Function),
    );
  });

  it("emits a toast event whenever a notification is received", () => {
    const message = "Hello world";

    renderHook(useSocketManager);

    mockSocketOn.mock.calls[0][1]({ message });

    expect(mockToast).toHaveBeenCalledWith({ description: message });
  });

  it("unsubscribes from notifications on unmount", () => {
    const { unmount } = renderHook(useSocketManager);

    expect(socket.off).not.toHaveBeenCalled();
    unmount();

    expect(socket.off).toHaveBeenCalledWith(
      ServerToClientEventName.Notification,
    );
  });
});
