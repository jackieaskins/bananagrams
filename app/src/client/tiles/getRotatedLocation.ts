import { BoardLocation } from "@/types/board";

export default function getRotatedLocation(
  rotation: number,
  { x, y }: BoardLocation,
): BoardLocation {
  const rotationMod = rotation % 4;

  switch (rotationMod) {
    case -3:
    case 1:
      return { x: -y, y: x };
    case -2:
    case 2:
      return { x: -x, y: -y };
    case -1:
    case 3:
      return { x: y, y: -x };
    default:
      return { x, y };
  }
}
