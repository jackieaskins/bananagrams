export const DUMP_ZONE_WIDTH = 120;

export enum CanvasName {
  Board = "board",
  BoardTile = "boardTile",
  DumpZone = "dumpZone",
  Hand = "hand",
  HandTile = "handTile",
  SelectRect = "selectRect",
}

export type Attrs = {
  x: number;
  y: number;
  name?: CanvasName;
};
