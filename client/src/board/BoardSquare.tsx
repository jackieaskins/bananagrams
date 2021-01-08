import { useRecoilCallback } from 'recoil';

import { BoardPosition } from '../boards/types';
import { useCurrentBoardSquare } from '../game/stateHooks';
import { moveTile } from '../socket';
import Tile from '../tile/Tile';
import { TILE_SIZE } from '../tile/constants';
import { selectedTileState } from '../tile/selectedTileState';
import { BORDER_STYLE } from './constants';

const BoardSquare = ({ row, col }: BoardPosition): JSX.Element => {
  const square = useCurrentBoardSquare({ row, col });

  const handleClick = useRecoilCallback(
    ({ set, snapshot }) => async () => {
      const selectedTile = await snapshot.getPromise(selectedTileState);

      if (selectedTile) {
        moveTile({
          tileId: selectedTile.tile.id,
          fromPosition: selectedTile.boardPosition,
          toPosition: { row, col },
        });

        set(selectedTileState, null);
      }
    },
    [row, col]
  );

  const selectTile = useRecoilCallback(
    ({ set, snapshot }) => async ({ tile }) => {
      const selectedTile = await snapshot.getPromise(selectedTileState);

      if (!selectedTile) {
        set(selectedTileState, { tile, boardPosition: { row, col } });
      }
    },
    [col, row]
  );

  return (
    <div
      css={{
        minWidth: `${TILE_SIZE}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        border: BORDER_STYLE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleClick}
    >
      {square ? (
        <Tile
          id={square.tile.id}
          letter={square.tile.letter}
          onClick={selectTile}
          validationStatus={square.validationStatus}
        />
      ) : null}
    </div>
  );
};

export default BoardSquare;
