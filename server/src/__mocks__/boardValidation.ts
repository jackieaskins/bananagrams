export const validateAddTile = jest
  .fn()
  .mockImplementation((squares, { row, col }, tile) => {
    squares[row][col] = { tile };
    return squares;
  });

export const validateRemoveTile = jest
  .fn()
  .mockImplementation((squares, { row, col }) => {
    squares[row][col] = null;
    return squares;
  });
