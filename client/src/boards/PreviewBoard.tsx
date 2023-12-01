import { Box, Card } from "@chakra-ui/react";
import { convertToArray } from "./convert";
import { Board } from "./types";

type PreviewBoardProps = {
  board: Board;
  tileSize: number;
};

export default function PreviewBoard({
  board,
  tileSize,
}: PreviewBoardProps): JSX.Element {
  const tilePixels = `${tileSize}px`;

  return (
    <Card display="inline-flex" flexDirection="column" variant="outline">
      {convertToArray(board).map((row, x) => (
        <Box key={x} display="flex">
          {row.map((boardSquare, y) => {
            const tile = boardSquare?.tile ?? null;

            if (tile === null) {
              return <Box key={y} height={tilePixels} width={tilePixels} />;
            }

            return (
              <img
                key={y}
                src={`/assets/images/${tile.letter}.png`}
                alt={`Tile for the letter ${tile.letter}`}
                width={tilePixels}
                height={tilePixels}
              />
            );
          })}
        </Box>
      ))}
    </Card>
  );
}
