import { TILE_SIZE } from './constants';

const Tile = ({ letter }: { letter: string }): JSX.Element => (
  <div
    className="no-drag"
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
    }}
  >
    {letter}
  </div>
);

export default Tile;
