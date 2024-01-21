import { useBreakpointValue } from "@chakra-ui/react";
import { Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasDumpZone from "./CanvasDumpZone";
import CanvasHand from "./CanvasHand";
import { DUMP_ZONE_WIDTH } from "./constants";
import { useHandCalculations } from "@/client/hands/useHandCalculations";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";

const PADDING = 15;
const SPACING = 7;
const GAP = 10;

export default function CanvasHandWrapper(): JSX.Element {
  const { size, tileSize } = useCanvasContext();
  const { hand } = useCurrentPlayer();

  const percent = useBreakpointValue(
    { base: 0.95, sm: 0.9, lg: 0.7 },
    { fallback: "lg" },
  );
  const { tilesPerRow, handHeight, handWidth } = useHandCalculations({
    hand,
    maxWidth: size.width * percent! - DUMP_ZONE_WIDTH - GAP,
    padding: PADDING,
    spacing: SPACING,
  });

  return (
    <Group
      x={size.width / 2 - (handWidth + DUMP_ZONE_WIDTH + GAP) / 2}
      y={size.height - handHeight - tileSize}
    >
      <CanvasDumpZone handHeight={handHeight} />
      <CanvasHand
        hand={hand}
        x={DUMP_ZONE_WIDTH + GAP}
        y={0}
        width={handWidth}
        height={handHeight}
        padding={PADDING}
        spacing={SPACING}
        tilesPerRow={tilesPerRow}
      />
    </Group>
  );
}
