import tileBreakdown from "./tileBreakdown";

describe("tileBreakdown", () => {
  it("has all letters", () => {
    expect(tileBreakdown).toHaveLength(26);
  });

  it("has 144 total tiles", () => {
    const count = tileBreakdown.reduce((sum, { count }) => sum + count, 0);
    expect(count).toBe(144);
  });
});
