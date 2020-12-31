import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import NameCell from './NameCell';

describe('<NameCell />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<NameCell player={playerFixture()} {...propOverrides} />);

  test('renders properly when not admin or top banana', () => {
    expect(
      renderComponent({
        player: playerFixture({ isAdmin: false, isTopBanana: false }),
      })
    ).toMatchSnapshot();
  });

  test('renders properly when is admin', () => {
    expect(
      renderComponent({
        player: playerFixture({ isAdmin: true, isTopBanana: false }),
      })
    ).toMatchSnapshot();
  });

  test('renders properly when is top banana', () => {
    expect(
      renderComponent({
        player: playerFixture({ isAdmin: false, isTopBanana: true }),
      })
    ).toMatchSnapshot();
  });

  test('renders properly when is admin and is top banana', () => {
    expect(
      renderComponent({
        player: playerFixture({ isAdmin: true, isTopBanana: true }),
      })
    ).toMatchSnapshot();
  });
});
