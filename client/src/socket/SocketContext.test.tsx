import { shallow, ShallowWrapper } from 'enzyme';
import { useEffect, useContext } from 'react';

import { SocketProvider, useSocket, SocketContext } from './SocketContext';

import { socket } from '.';

jest.mock('react', () => ({
  ...(jest.requireActual('react') as Record<string, unknown>),
  useContext: jest.fn(),
  useEffect: jest.fn().mockImplementation((f) => f()),
}));
jest.mock('./index', () => ({
  socket: {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  },
}));

describe('SocketContext', () => {
  describe('<SocketProvider />', () => {
    let component: ShallowWrapper;

    beforeEach(() => {
      component = shallow(<SocketProvider>children</SocketProvider>);
    });

    test('renders provider properly', () => {
      expect(component).toMatchSnapshot();
    });

    test('disconnects from socket on dismount', () => {
      (useEffect as jest.Mock).mock.calls[0][0]()();

      expect(socket.disconnect).toHaveBeenCalledWith();
    });
  });

  describe('useSocket', () => {
    test('calls useContext with SocketContext', () => {
      useSocket();
      expect(useContext).toHaveBeenCalledWith(SocketContext);
    });
  });
});
