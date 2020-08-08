import tileBreakdown from './tileBreakdown';

describe('tileBreakdown', () => {
  test('has all letters', () => {
    expect(tileBreakdown).toHaveLength(26);
  });

  test('has 144 total tiles', () => {
    const count = tileBreakdown.reduce((sum, { count }) => sum + count, 0);
    expect(count).toEqual(144);
  });
});
