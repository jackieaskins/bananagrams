import { memo } from 'react';

type PreviewTileProps = {
  id: string;
  letter: string;
};

const PreviewTile = ({ id, letter }: PreviewTileProps): JSX.Element => (
  <div
    key={id}
    css={{
      alignItems: 'center',
      backgroundColor: '#ffffc7',
      display: 'flex',
      fontSize: '7px',
      height: '15px',
      justifyContent: 'center',
      width: '15px',
    }}
  >
    {letter}
  </div>
);

export default memo(PreviewTile);
