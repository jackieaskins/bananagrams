import { shallow } from 'enzyme';

import SocketDisconnectModal from './SocketDisconnectModal';

import { addDisconnectListener } from '.';

const mockSetShouldShowModal = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()),
  useState: jest
    .fn()
    .mockImplementation((init) => [init, mockSetShouldShowModal]),
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
}));

const mockAddDisconnectListener = addDisconnectListener as jest.Mock;
jest.mock('.', () => ({
  addDisconnectListener: jest.fn(),
}));

describe('<SocketDisconnectModal />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<SocketDisconnectModal {...propOverrides} />);

  it('renders modal', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('adds listener on socket disconnect', () => {
    renderComponent();

    expect(mockAddDisconnectListener).toHaveBeenCalled();

    mockAddDisconnectListener.mock.calls[0][0]();
    expect(mockSetShouldShowModal).toHaveBeenCalledWith(true);
  });

  describe('footer button', () => {
    const getButtonProps = () => renderComponent().props().footer.props;

    it('redirects to homepage', () => {
      getButtonProps().onClick();

      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('hides modal', () => {
      getButtonProps().onClick();

      expect(mockSetShouldShowModal).toHaveBeenCalledWith(false);
    });
  });
});
