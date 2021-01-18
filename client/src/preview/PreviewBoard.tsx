import { Board, getSquareId } from '../boards/types';
import { getBoardBoundaries } from '../boards/validate';
import TransparentCard from '../card/TransparentCard';
import PreviewTile from './PreviewTile';
import { TILE_SIZE } from './constants';

type PreviewBoardProps = {
  board: Board;
};

const PreviewBoard = ({ board }: PreviewBoardProps): JSX.Element => {
  const { rowStart, rowEnd, colStart, colEnd } = getBoardBoundaries(board);

  const boardRows = [];

  if (
    rowStart != null &&
    rowEnd != null &&
    colStart != null &&
    colEnd != null
  ) {
    for (let row = rowStart; row <= rowEnd; row++) {
      const boardRow = [];
      for (let col = colStart; col <= colEnd; col++) {
        const id = getSquareId({ row, col });
        const square = board[id];

        if (square) {
          boardRow.push(
            <PreviewTile
              key={square.tile.id}
              id={square.tile.id}
              letter={square.tile.letter}
            />
          );
        } else {
          boardRow.push(
            <div
              key={id}
              css={{ height: `${TILE_SIZE}px`, width: `${TILE_SIZE}px` }}
            />
          );
        }
      }

      boardRows.push(
        <div key={row} css={{ display: 'flex' }}>
          {boardRow}
        </div>
      );
    }
  }

  return (
    <TransparentCard
      bodyStyle={{ padding: 0 }}
      cardCSS={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        margin: '5px 0',
      }}
    >
      <div>{boardRows}</div>
    </TransparentCard>
  );
};

export default PreviewBoard;
