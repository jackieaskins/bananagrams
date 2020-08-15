import React from 'react';
import { shallow } from 'enzyme';
import GameSidebar from './GameSidebar';

jest.mock('../styles', () => ({
  useStyles: () => ({
    drawerPaper: 'drawerPaper',
  }),
}));

jest.mock('./GameSidebarState', () => ({
  useGameSidebar: () => ({
    leaveGameDialogOpen: true,
    showLeaveGameDialog: jest.fn().mockName('showLeaveGameDialog'),
    handleLeaveGameCancel: jest.fn().mockName('handleLeaveGameCancel'),
  }),
}));

describe('<GameSidebar />', () => {
  test('renders properly', () => {
    expect(shallow(<GameSidebar />)).toMatchSnapshot();
  });
});
