import { BoardLocation } from "./models/Board";

const SEPARATOR = ",";

export function generateBoardKey({ x, y }: BoardLocation): string {
  return [x, y].join(SEPARATOR);
}

export function parseBoardKey(boardKey: string): BoardLocation {
  const [x, y] = boardKey.split(SEPARATOR).map((num) => Number.parseInt(num));
  return { x, y };
}
