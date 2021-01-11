import { useMemo } from 'react';
import { useRecoilCallback } from 'recoil';

import { useCurrentHand } from '../game/stateHooks';
import { moveTile } from '../socket';
import Tile from '../tile/Tile';
import { selectedTileState } from '../tile/selectedTileState';

const Hand = (): JSX.Element => {
  const hand = useCurrentHand();

  const selectTile = useRecoilCallback(
    ({ set, snapshot }) => async ({ tile }) => {
      const selectedTile = await snapshot.getPromise(selectedTileState);

      if (selectedTile?.boardPosition) {
        moveTile({
          tileId: tile.id,
          fromPosition: null,
          toPosition: selectedTile.boardPosition,
        });
        set(selectedTileState, null);
      } else {
        set(selectedTileState, { tile, boardPosition: null });
      }
    },
    []
  );

  const tiles = useMemo(
    () =>
      (hand ?? []).map((tile) => (
        <Tile
          key={tile.id}
          id={tile.id}
          letter={tile.letter}
          onClick={selectTile}
        />
      )),
    [hand, selectTile]
  );

  return (
    <div
      className="overlay"
      css={{
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
      }}
    >
      {tiles}
    </div>
  );
};

export default Hand;
