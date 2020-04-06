import { DragObjectWithType } from 'react-dnd';

export type Tile = {
  id: string;
  letter: string;
};

export interface TileItem extends DragObjectWithType {
  id: string;
  boardPosition: { x: number; y: number } | null;
}
