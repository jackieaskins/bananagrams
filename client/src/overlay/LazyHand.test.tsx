import { mount } from 'enzyme';
import { Suspense } from 'react';

import LazyHand from './LazyHand';

describe('<LazyHand />', () => {
  const renderComponent = (propOverrides = {}) =>
    mount(
      <Suspense fallback="Loading">
        <LazyHand {...propOverrides} />
      </Suspense>
    );

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
