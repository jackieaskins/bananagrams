import { useServerDisconnectionDialog } from './ServerDisconnectionDialogState';

const mockSetShouldShowDialog = jest.fn();
jest.mock('react', () => ({
  useEffect: jest.fn().mockImplementation((f) => f()),
  useState: jest
    .fn()
    .mockImplementation((initialValue) => [
      initialValue,
      mockSetShouldShowDialog,
    ]),
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
}));

const mockOn = jest.fn();
jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: { on: mockOn },
  }),
}));

describe('useServerDisconnectionDialog', () => {
  it('listens for socket disconnect event', () => {
    useServerDisconnectionDialog();
    expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('on disconnect shows dialog', () => {
    useServerDisconnectionDialog();
    mockOn.mock.calls[0][1]();

    expect(mockSetShouldShowDialog).toHaveBeenCalledWith(true);
  });

  describe('hideDialog', () => {
    beforeEach(() => {
      useServerDisconnectionDialog().hideDialog();
    });

    it('redirects to homepage', () => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('hides dialog', () => {
      expect(mockSetShouldShowDialog).toHaveBeenCalledWith(false);
    });
  });
});
