import React from 'react';
import { shallow } from 'enzyme';

type CallbackFn = (...args: any[]) => any;

const TestHook = ({ callback }: { callback: CallbackFn }): null => {
  callback();
  return null;
};

export const testHook = (callback: CallbackFn): void => {
  shallow(<TestHook callback={callback} />);
};
