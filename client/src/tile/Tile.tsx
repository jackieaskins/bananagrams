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
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        backgroundColor: '#ffffc7',
        border: '0.5px solid black',
        borderRadius: '5px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isSelectedTile ? 0.5 : 1,
      }}
      onClick={handleClick}
    >
      {letter}
    </div>
  );
};
export default memo(Tile);
