import { Property } from "csstype";
import { KonvaEventObject } from "konva/lib/Node";

export function setCursor(
  evt: KonvaEventObject<PointerEvent>,
  cursor: Property.Cursor,
): void {
  const container = evt.target.getStage()?.container();

  if (container) {
    container.style.cursor = cursor;
  }
}

export function setCursorWrapper(cursor: Property.Cursor) {
  return function (evt: KonvaEventObject<PointerEvent>): void {
    setCursor(evt, cursor);
  };
}
