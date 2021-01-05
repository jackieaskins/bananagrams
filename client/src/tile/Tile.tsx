import { memo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';

import { Tile as TileType } from '../tiles/types';
import { TILE_SIZE } from './constants';
import { selectedTileState } from './selectedTileState';

interface TileProps extends TileType {
  onClick?: ({ tile }: { tile: TileType }) => void;
}

const Tile = ({ onClick, id, letter }: TileProps): JSX.Element => {
  const selectedTile = useRecoilValue(selectedTileState);
  const isSelectedTile = selectedTile?.tile?.id === id;

  const handleClick = useCallback(() => {
    onClick?.({ tile: { id, letter } });
  }, [id, letter, onClick]);

  return (
    <div
      className="no-drag tile"
      css={{
        alignItems: 'center',
        backgroundColor: '#ffffc7',
        border: '0.5px solid black',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        flexShrink: 0,
        height: `${TILE_SIZE}px`,
        justifyContent: 'center',
        opacity: isSelectedTile ? 0.5 : 1,
        width: `${TILE_SIZE}px`,
      }}
      onClick={handleClick}
    >
      {letter}
    </div>
  );
};
export default memo(Tile);
