import { Popconfirm } from 'antd';
import { shallow } from 'enzyme';

import LeaveGameButton from './LeaveGameButton';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

describe('<LeaveGameButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<LeaveGameButton {...propOverrides} />);

  it('renders floating button with confirmation and tooltip', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('confirms redirect to homepage', () => {
    renderComponent().find(Popconfirm).props().onConfirm();

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
