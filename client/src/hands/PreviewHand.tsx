import { Box } from "@mui/material";
import TransparentPaper from "../paper/TransparentPaper";
import { Hand } from "./types";

type PreviewHandProps = {
  hand: Hand;
  tileSize: number;
};

export default function PreviewHand({
  hand,
  tileSize,
}: PreviewHandProps): JSX.Element {
  const tilePixels = `${tileSize}px`;

  return (
    <TransparentPaper
      component={Box}
      // @ts-expect-error These are accepted since the component is a Box
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
}
