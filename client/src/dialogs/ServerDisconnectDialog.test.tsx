import { shallow } from 'enzyme';

import ServerDisconnectionDialog from './ServerDisconnectionDialog';

jest.mock('./ServerDisconnectionDialogState', () => ({
  useServerDisconnectionDialog: () => ({
    shouldShowDialog: true,
    hideDialog: jest.fn().mockName('hideDialog'),
  }),
}));

describe('<ServerDisconnectionDialog />', () => {
  it('renders properly', () => {
    expect(shallow(<ServerDisconnectionDialog />)).toMatchSnapshot();
  });
});
