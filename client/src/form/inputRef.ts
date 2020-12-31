import { Input } from 'antd';
import { RefObject, useEffect, useRef } from 'react';

export const useFocusRef = (): RefObject<Input> => {
  const focusRef = useRef<Input>(null);

  useEffect(() => {
    focusRef?.current?.focus?.();
  }, [focusRef]);

  return focusRef;
};
