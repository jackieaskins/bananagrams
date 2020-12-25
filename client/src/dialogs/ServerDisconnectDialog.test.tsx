import { shallow } from 'enzyme';
import React from 'react';

import ServerDisconnectionDialog from './ServerDisconnectionDialog';

jest.mock('./ServerDisconnectionDialogState', () => ({
  useServerDisconnectionDialog: () => ({
    shouldShowDialog: true,
    hideDialog: jest.fn().mockName('hideDialog'),
  }),
}));

describe('<ServerDisconnectionDialog />', () => {
  test('renders properly', () => {
    expect(shallow(<ServerDisconnectionDialog />)).toMatchSnapshot();
  });
});
