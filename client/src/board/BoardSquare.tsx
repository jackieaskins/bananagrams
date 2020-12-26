import { TILE_SIZE } from '../tile/constants';
import { BORDER_STYLE } from './constants';

const BoardSquare = (): JSX.Element => (
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
  />
);

export default BoardSquare;
