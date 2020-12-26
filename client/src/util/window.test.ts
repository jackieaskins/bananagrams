import { useEffect } from 'react';

import { useWindowSize } from './window';

const mockSetWindowSize = jest.fn();
jest.mock('react', () => ({
  useEffect: jest.fn().mockImplementation((fn) => fn()),
  useState: jest.fn().mockImplementation((init) => [init, mockSetWindowSize]),
}));

describe('window', () => {
  const mockAddEventListener = jest.fn();
  const mockRemoveEventListener = jest.fn();
  let windowSpy: jest.SpyInstance;

  beforeAll(() => {
    windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockReturnValue({
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });
  });

  afterAll(() => {
    windowSpy.mockRestore();
  });

  describe('useWindowSize', () => {
    test('initializes window size', () => {
      expect(useWindowSize()).toEqual({
        width: 1024,
        height: 768,
      });
    });

    test('adds resize event listener on mount', () => {
      useWindowSize();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      mockAddEventListener.mock.calls[0][1]();
      expect(mockSetWindowSize).toHaveBeenCalledWith({
        width: 1024,
        height: 768,
      });
    });

    test('removes resize event listener on dismount', () => {
      useWindowSize();
      (useEffect as jest.Mock).mock.results[0].value();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      mockRemoveEventListener.mock.calls[0][1]();
      expect(mockSetWindowSize).toHaveBeenCalledWith({
        width: 1024,
        height: 768,
      });
    });
  });
});
