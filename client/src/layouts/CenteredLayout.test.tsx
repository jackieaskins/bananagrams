import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CenteredLayout from './CenteredLayout';

describe('CenteredLayout', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('render properly', () => {
    expect(
      renderer.render(<CenteredLayout>Children</CenteredLayout>)
    ).toMatchSnapshot();
  });
});
