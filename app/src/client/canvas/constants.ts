export const DUMP_ZONE_WIDTH = 120;

export enum CanvasName {
  Board = "board",
  BoardTile = "boardTile",
  DumpZone = "dumpZone",
  Hand = "hand",
  HandTile = "handTile",
}

export type Attrs = {
  x: number;
  y: number;
  name?: CanvasName;
};
