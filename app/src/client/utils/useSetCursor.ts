import { Property } from "csstype";
import { useEffect } from "react";
import useCanDump from "./useCanDump";
import { useCanvasContext } from "@/client/canvas/CanvasContext";
import { Selection } from "@/client/canvas/CanvasSelectRect";
import { Attrs, CanvasName } from "@/client/canvas/constants";
import { useKeys } from "@/client/keys/KeysContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

export default function useSetCursor(selection: Selection | null): void {
  const { selectedTiles } = useSelectedTiles();
  const { cursorPosition, stageRef } = useCanvasContext();
  const { ctrlDown, shiftDown } = useKeys();
  const canDump = useCanDump();

  useEffect(() => {
    const getCursor = (): Property.Cursor => {
      const intersectionName: CanvasName | undefined = (
        stageRef.current?.getIntersection(cursorPosition)?.attrs as Attrs
      )?.name;

      if (
        ctrlDown &&
        (intersectionName === CanvasName.Board ||
          intersectionName === CanvasName.BoardTile)
      ) {
        return "cell";
      }

      if (selection) {
        return "crosshair";
      }

      if (
        shiftDown &&
        intersectionName !== CanvasName.Hand &&
        intersectionName !== CanvasName.HandTile &&
        intersectionName !== CanvasName.DumpZone
      ) {
        return "crosshair";
      }

      if (intersectionName === CanvasName.DumpZone && !canDump) {
        return "no-drop";
      }

      if (
        shiftDown &&
        intersectionName === CanvasName.HandTile &&
        selectedTiles &&
        !selectedTiles.boardLocation
      ) {
        return "pointer";
      }

      if (selectedTiles) {
        return "grabbing";
      }

      if (
        intersectionName === CanvasName.BoardTile ||
        intersectionName === CanvasName.HandTile
      ) {
        return "grab";
      }

      if (intersectionName === CanvasName.Hand) {
        return "default";
      }

      return "move";
    };

    const container = stageRef.current?.container();
    if (container) {
      container.style.cursor = getCursor();
    }
  }, [
    canDump,
    ctrlDown,
    cursorPosition,
    selectedTiles,
    selection,
    shiftDown,
    stageRef,
  ]);
}
