import { Board, BoardPosition, ValidationStatus, getSquareId } from './types';

type BoardBoundaries = {
  rowStart: number | null;
  rowEnd: number | null;
  colStart: number | null;
  colEnd: number | null;
};

const getBoardBoundaries = (board: Board): BoardBoundaries => {
  let rowStart: number | null = null;
  let rowEnd: number | null = null;
  let colStart: number | null = null;
  let colEnd: number | null = null;

  Object.keys(board).forEach((id) => {
    const [r, c] = id.split(',');

    const row = parseInt(r);
    const col = parseInt(c);

    if (rowStart == null || row < rowStart) rowStart = row;
    if (rowEnd == null || row > rowEnd) rowEnd = row;
    if (colStart == null || col < colStart) colStart = col;
    if (colEnd == null || col > colEnd) colEnd = col;
  });

  return {
    rowStart,
    rowEnd,
    colStart,
    colEnd,
  };
};

export const isValidConnectedBoard = (board: Board): boolean => {
  const { rowStart, rowEnd, colStart, colEnd } = getBoardBoundaries(board);

  if (
    rowStart == null ||
    rowEnd == null ||
    colStart == null ||
    colEnd == null
  ) {
    return false;
  }

  const getSurroundingTiles = (row: number, col: number): BoardPosition[] =>
    [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ].filter(
      ({ row, col }) =>
        row >= rowStart && row <= rowEnd && col >= colStart && col <= colEnd
    );

  const stack: BoardPosition[] = [];
  let connectedComponents = 0;
  const visited = new Set<string>();

  const shouldCheckTile = (row: number, col: number): boolean => {
    const squareId = getSquareId({ row, col });
    return !!board[squareId] && !visited.has(squareId);
  };

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      if (shouldCheckTile(row, col)) {
        if (connectedComponents > 0) {
          return false;
        }
        connectedComponents++;

        stack.push({ row, col });
        while (stack.length > 0) {
          const { row, col } = stack.pop() as BoardPosition;
          const squareId = getSquareId({ row, col });
          visited.add(squareId);

          if (
            Object.values(board).some(
              (square) => square?.validationStatus === ValidationStatus.INVALID
            )
          ) {
            return false;
          }

          getSurroundingTiles(row, col).forEach(({ row, col }) => {
            if (shouldCheckTile(row, col)) stack.push({ row, col });
          });
        }
      }
    }
  }

  return connectedComponents === 1;
};
