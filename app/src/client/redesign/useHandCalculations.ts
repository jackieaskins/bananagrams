import { useCanvasContext } from "./CanvasContext";
import { Hand } from "@/types/hand";

type HandCalculationsInput = {
  hand: Hand;
  maxWidth: number;
  padding: number;
  spacing: number;
};

type HandCalculationsOutput = {
  tilesPerRow: number;
  handHeight: number;
  handWidth: number;
};

export function useHandCalculations({
  hand,
  maxWidth,
  padding,
  spacing,
}: HandCalculationsInput): HandCalculationsOutput {
  const { tileSize } = useCanvasContext();

  const tilesPerRow = Math.floor(
    (maxWidth - padding * 2 + spacing) / (tileSize + spacing),
  );
  const numRows = Math.max(Math.ceil(hand.length / tilesPerRow), 2);

  return {
    handWidth:
      padding * 2 + tilesPerRow * tileSize + spacing * (tilesPerRow - 1),
    handHeight: padding * 2 + numRows * tileSize + spacing * (numRows - 1),
    tilesPerRow,
  };
}
