import { Button } from 'antd';
import { shallow } from 'enzyme';
import { useState } from 'react';

import { boardSquareFixture } from '../fixtures/board';
import { playerFixture } from '../fixtures/player';
import PreviewCarousel from './PreviewCarousel';

const mockUseState = useState as jest.Mock;
const mockSetSelectedUserId = jest.fn().mockName('mockSetSelectedUserId');
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn((fn) => fn()),
  useState: jest.fn(),
}));

describe('<PreviewCarousel />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <PreviewCarousel
        players={[
          playerFixture({ userId: 'p1' }),
          playerFixture({ userId: 'p2' }),
        ]}
        boards={{
          p1: { '0,0': boardSquareFixture() },
          p2: { '1,1': boardSquareFixture() },
        }}
        hands={{
          p1: [{ id: 'B1', letter: 'B' }],
          p2: [{ id: 'B2', letter: 'B' }],
        }}
        {...propOverrides}
      />
    );

  beforeEach(() => {
    mockUseState.mockImplementation((init) => [init, mockSetSelectedUserId]);
  });

  it('renders carousel with first user selected', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders if no players, hands, or boards', () => {
    expect(
      renderComponent({ players: [], hands: {}, boards: {} })
    ).toMatchSnapshot();
  });

  it('updates selected user id if current is invalid', () => {
    mockUseState.mockReturnValue([undefined, mockSetSelectedUserId]);

    renderComponent();

    expect(mockSetSelectedUserId).toHaveBeenCalledWith('p1');
  });

  describe('left click', () => {
    const clickLeftButton = (currentUserId?: string) => {
      renderComponent().find(Button).first().simulate('click');

      return mockSetSelectedUserId.mock.calls[0][0](currentUserId);
    };

    it('goes to the left', () => {
      expect(clickLeftButton('p2')).toEqual('p1');
    });

    it('goes to last player if on first', () => {
      expect(clickLeftButton('p1')).toEqual('p2');
    });

    it('goes to last player if no current selection', () => {
      expect(clickLeftButton()).toEqual('p2');
    });
  });

  describe('right click', () => {
    const clickRightButton = (currentUserId?: string) => {
      renderComponent().find(Button).last().simulate('click');

      return mockSetSelectedUserId.mock.calls[0][0](currentUserId);
    };

    it('goes to the right', () => {
      expect(clickRightButton('p1')).toEqual('p2');
    });

    it('goes to first player if on last', () => {
      expect(clickRightButton('p2')).toEqual('p1');
    });

    it('goes to first player if no current selection', () => {
      expect(clickRightButton()).toEqual('p1');
    });
  });
});
