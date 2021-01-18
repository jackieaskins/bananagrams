import { memo, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { ValidationStatus } from '../board/types';
import { TILE_SIZE } from './constants';
import { selectedTileState } from './selectedTileState';
import { Tile as TileType } from './types';

interface TileProps extends TileType {
  onClick?: ({ tile }: { tile: TileType }) => void;
  validationStatus?: ValidationStatus;
}

const Tile = ({
  onClick,
  id,
  letter,
  validationStatus = ValidationStatus.NOT_VALIDATED,
}: TileProps): JSX.Element => {
  const selectedTile = useRecoilValue(selectedTileState);
  const isSelectedTile = selectedTile?.tile?.id === id;

  const handleClick = useCallback(() => {
    onClick?.({ tile: { id, letter } });
  }, [id, letter, onClick]);

  const color = useMemo(() => {
    if (validationStatus === ValidationStatus.VALID) {
      return 'green';
    }

    if (validationStatus === ValidationStatus.INVALID) {
      return 'red';
    }

    return 'black';
  }, [validationStatus]);

  return (
    <div
      className="no-drag no-drop tile"
      css={{
        alignItems: 'center',
        backgroundColor: '#ffffc7',
        border: `0.5px solid ${color}`,
        borderRadius: '5px',
        color,
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
