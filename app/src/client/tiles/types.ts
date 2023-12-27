import { DragObjectWithType } from "react-dnd";

export interface TileItem extends DragObjectWithType {
  id: string;
  boardLocation: { x: number; y: number } | null;
}
