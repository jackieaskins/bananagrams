import { Alert, Form as AntForm } from 'antd';
import { FormProps } from 'antd/lib/form';
import { shallow } from 'enzyme';
import { useState } from 'react';

import Form from './Form';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useState: jest.fn(),
}));

const mockHandleSubmitInner = jest.fn();
const mockHandleSubmit = jest.fn().mockReturnValue(mockHandleSubmitInner);
const mockSetError = jest.fn();
const mockUseState = useState as jest.Mock;
describe('<Form />', () => {
  beforeEach(() => {
    mockUseState.mockImplementation((init) => [init, mockSetError]);
  });

  const renderComponent = (propOverrides = {}) =>
    shallow(
      <Form onSubmit={mockHandleSubmit} {...propOverrides}>
        <div />
      </Form>
    );

  it('renders ant design form', () => {
    expect(
      renderComponent({ initialValues: { initial: 'values' } })
    ).toMatchSnapshot();
  });

  it('renders error if there is an error', () => {
    mockUseState.mockReturnValue(['error', mockSetError]);

    expect(renderComponent().find(Alert)).toMatchSnapshot();
  });

  it('calls handleSubmit and inner function on submit', () => {
    const values = { form: 'values' };
    (renderComponent().find(AntForm).props() as FormProps).onFinish?.(values);

    expect(mockHandleSubmit).toHaveBeenCalledWith(mockSetError);
    expect(mockHandleSubmitInner).toHaveBeenCalledWith(values);
  });
});
