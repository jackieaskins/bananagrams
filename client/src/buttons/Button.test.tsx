import { shallow } from 'enzyme';

import Button from './Button';

describe('<Button />', () => {
  const renderButton = (propOverrides = {}) =>
    shallow(
      <Button onClick={jest.fn().mockName('onClick')} {...propOverrides}>
        Button
      </Button>
    );

  it('renders properly while loading', () => {
    expect(
      renderButton({ loadingText: 'Loading', loading: true })
    ).toMatchSnapshot();
  });

  it('renders properly when disabled', () => {
    expect(renderButton({ disabled: true })).toMatchSnapshot();
  });
});
