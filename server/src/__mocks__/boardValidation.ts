export const validateAddTile = jest
  .fn()
  .mockImplementation((squares, { x, y }, tile) => {
    squares[x][y] = { tile };
    return squares;
  });

export const validateRemoveTile = jest
  .fn()
  .mockImplementation((squares, { x, y }) => {
    squares[x][y] = null;
    return squares;
  });
