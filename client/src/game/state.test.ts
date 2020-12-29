import { useRecoilCallback, useRecoilValue } from 'recoil';

import { useIsGameInProgress, useUpdateGameState } from './state';

const mockGameInProgressState = 'mockGameInProgressState';
const mockSet = jest.fn();
jest.mock('recoil', () => ({
  atom: jest.fn().mockReturnValueOnce('mockGameInProgressState'),
  useRecoilCallback: jest.fn((f) => f({ set: mockSet })),
  useRecoilValue: jest.fn().mockReturnValueOnce(true),
}));

const mockUseRecoilCallback = useRecoilCallback as jest.Mock;
const mockUseRecoilValue = useRecoilValue as jest.Mock;
describe('game state', () => {
  test('useIsGameInProgress gets value of gameInProgressState', () => {
    expect(useIsGameInProgress()).toEqual(true);
    expect(mockUseRecoilValue).toHaveBeenCalledWith(mockGameInProgressState);
  });

  test('useUpdateGameState updates game state through recoil callback', () => {
    useUpdateGameState();
    mockUseRecoilCallback.mock.results[0].value({ isInProgress: false });

    expect(mockUseRecoilCallback).toHaveBeenCalledWith(
      expect.any(Function),
      []
    );
    expect(mockSet).toHaveBeenCalledWith(mockGameInProgressState, false);
  });
});
