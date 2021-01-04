import { mount } from 'enzyme';
import { Suspense } from 'react';

import LazyBoardWrapper from './LazyBoardWrapper';

describe('<LazyBoardWrapper />', () => {
  const renderComponent = (propOverrides = {}) =>
    mount(
      <Suspense fallback="Loading">
        <LazyBoardWrapper {...propOverrides} />
      </Suspense>
    );

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
