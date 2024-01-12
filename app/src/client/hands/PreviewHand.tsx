import { Card } from "@chakra-ui/react";
import { Hand } from "@/types/hand";

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
    <Card
      display="inline-flex"
      flexWrap="wrap"
      variant="outline"
      flexDirection="row"
      minHeight={tilePixels}
    >
      {hand.map((tile) => (
        <img
          key={tile.id}
          src={`/images/${tile.letter}.png`}
          alt={`Tile for the letter ${tile.letter}`}
          width={tilePixels}
          height={tilePixels}
        />
      ))}
    </Card>
  );
}
