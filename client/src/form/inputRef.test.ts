import { useRef } from 'react';

import { useFocusRef } from './inputRef';

const mockUseRef = useRef as jest.Mock;
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()),
  useRef: jest.fn(),
}));

describe('inputRef', () => {
  describe('useFocusRef', () => {
    test('returns focus ref', () => {
      const mockReturnValue = null;
      mockUseRef.mockReturnValue(mockReturnValue);

      expect(useFocusRef()).toEqual(mockReturnValue);
    });

    test('calls focus if it exists', () => {
      const mockFocus = jest.fn();
      mockUseRef.mockReturnValue({
        current: { focus: mockFocus },
      });

      useFocusRef();

      expect(mockFocus).toHaveBeenCalledWith();
    });
  });
});
