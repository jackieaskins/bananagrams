import { useCopyToClipboard } from './CopyToClipboardState';

const mockSetShouldShow = jest.fn();
jest.mock('react', () => ({
  useState: jest
    .fn()
    .mockImplementation((initialValue) => [initialValue, mockSetShouldShow]),
  useEffect: jest.fn().mockImplementation((f) => f()),
}));

const mockEnqueueSnackbar = jest.fn();
jest.mock('notistack', () => ({
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  }),
}));

describe('useCopyToClipboard', () => {
  const mockWriteText = jest.fn();
  const mockQuery = jest.fn();

  const currentEventLoopEnd = () =>
    new Promise((resolve) => setImmediate(resolve));

  beforeEach(() => {
    global.navigator.permissions = {
      query: mockQuery,
    };
    global.navigator.clipboard = {
      writeText: mockWriteText,
    };
  });

  describe('shouldShow', () => {
    test('calls navigator permissions query', () => {
      mockQuery.mockResolvedValue({ state: 'granted' });

      useCopyToClipboard();

      expect(mockQuery).toHaveBeenCalledWith({
        name: 'clipboard-write',
      });
    });

    test('is true when navigator permissions query state is granted', async () => {
      mockQuery.mockResolvedValue({ state: 'granted' });

      useCopyToClipboard();

      await currentEventLoopEnd();

      expect(mockSetShouldShow).toHaveBeenCalledWith(true);
    });

    test('is true when navigator permissions query state is prompt', async () => {
      mockQuery.mockResolvedValue({ state: 'prompt' });

      useCopyToClipboard();

      await currentEventLoopEnd();

      expect(mockSetShouldShow).toHaveBeenCalledWith(true);
    });

    test('is false when navigator permissions query state is not granted or prompt', async () => {
      mockQuery.mockResolvedValue({ state: 'some-other-state' });

      useCopyToClipboard();

      await currentEventLoopEnd();

      expect(mockSetShouldShow).toHaveBeenCalledWith(false);
    });
  });

  describe('copyToClipboard', () => {
    test('calls writeText', async () => {
      mockWriteText.mockResolvedValue(null);

      await useCopyToClipboard().copyToClipboard('copyText');

      expect(mockWriteText).toHaveBeenCalledWith('copyText');
    });

    test('calls enqueueSnackbar on success', async () => {
      mockWriteText.mockResolvedValue(null);

      await useCopyToClipboard().copyToClipboard('copyText');

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Successfully copied to clipboard.'
      );
    });

    test('calls enqueueSnackbar on error', async () => {
      mockWriteText.mockRejectedValue(null);

      await useCopyToClipboard().copyToClipboard('copyText');

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Unable to copy to clipboard.'
      );
    });
  });
});
