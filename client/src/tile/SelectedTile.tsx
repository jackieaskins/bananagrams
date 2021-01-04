import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Tile from './Tile';
import { selectedTileState } from './selectedTileState';

const SelectedTile = (): JSX.Element | null => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const selectedTile = useRecoilValue(selectedTileState);

  useEffect(() => {
    const onMouseMove = ({ clientX: x, clientY: y }: MouseEvent): void => {
      setMousePosition({ x, y });
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (!selectedTile) {
    return null;
  }

  const { x, y } = mousePosition;
  const {
    tile: { id, letter },
  } = selectedTile;

  return (
    <div
      css={{
        position: 'fixed',
        left: `${x + 5}px`,
        top: `${y + 5}px`,
        zIndex: 1000000,
      }}
    >
      <Tile id={id} letter={letter} />
    </div>
  );
};

export default SelectedTile;
