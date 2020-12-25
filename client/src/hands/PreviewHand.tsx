/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from '@material-ui/core';
import React from 'react';

import TransparentPaper from '../paper/TransparentPaper';
import { Hand } from './types';

type PreviewHandProps = {
  hand: Hand;
  tileSize: number;
};

const PreviewHand: React.FC<PreviewHandProps> = ({ hand, tileSize }) => {
  const tilePixels = `${tileSize}px`;

  return (
    <TransparentPaper
      component={Box}
      // @ts-ignore
      display="inline-flex"
      flexWrap="wrap"
      width="100%"
    >
      {hand.map((tile) => (
        <img
          key={tile.id}
          src={`/assets/images/${tile.letter}.png`}
          alt={`Tile for the letter ${tile.letter}`}
          width={tilePixels}
          height={tilePixels}
        />
      ))}
    </TransparentPaper>
  );
};

export default PreviewHand;
