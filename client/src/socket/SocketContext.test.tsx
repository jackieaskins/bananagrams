import { ShallowWrapper, shallow } from "enzyme";
import { useContext, useEffect } from "react";
import { SocketContext, SocketProvider, useSocket } from "./SocketContext";
import socket from ".";

jest.mock("react", () => ({
  ...(jest.requireActual("react") as Record<string, unknown>),
  useContext: jest.fn(),
  useEffect: jest.fn().mockImplementation((f) => f()),
}));
jest.mock("./index", () => ({
  on: jest.fn(),
  emit: jest.fn(),
}));
const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
  useToast: () => mockToast,
}));

describe("SocketContext", () => {
  describe("<SocketProvider />", () => {
    let component: ShallowWrapper;

    beforeEach(() => {
      component = shallow(<SocketProvider>children</SocketProvider>);
    });

    test("renders provider properly", () => {
      expect(component).toMatchSnapshot();
    });

    test("listens on socket for notifications", () => {
      expect(socket.on).toHaveBeenCalledWith(
        "notification",
        expect.any(Function),
      );
    });

    test("enqueues message to snackbar on message received", () => {
      const message = "Message";

      socket.on.mock.calls[0][1]({ message });

      expect(mockToast).toHaveBeenCalledWith({ description: message });
    });

    test("disconnects from socket on dismount", () => {
      useEffect.mock.calls[0][0]()();

      expect(socket.emit).toHaveBeenCalledWith("disconnect");
    });
  });

  describe("useSocket", () => {
    test("calls useContext with SocketContext", () => {
      useSocket();
      expect(useContext).toHaveBeenCalledWith(SocketContext);
    });
  });
});
