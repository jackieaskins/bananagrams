import Konva from "konva";
import { useCallback, useRef } from "react";
import { Group, Rect, Text } from "react-konva";
import { BoardLocation } from "../boards/types";
import { useGame } from "../games/GameContext";
import { Tile } from "../tiles/types";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import { setCursor, setCursorWrapper } from "./setCursor";
import { useColorHex } from "./useColorHex";

export type TileProps = {
  position: "hand" | "board";
  tile: Tile;
  x: number;
  y: number;
};

export default function CanvasTile({
  position,
  tile: { letter, id },
  x,
  y,
}: TileProps): JSX.Element {
  const { handRectRef, stageRef, offset } = useCanvasContext();
  const tileRef = useRef<Konva.Group>(null);
  const [tileBg] = useColorHex(["yellow.100"]);
  const {
    handleMoveTileFromBoardToHand,
    handleMoveTileFromHandToBoard,
    handleMoveTileOnBoard,
  } = useGame();

  const snapToBoard = useCallback(
    (location: BoardLocation) => {
      function roundDown(val: number, multiplier: number): number {
        return Math.floor(val / multiplier) * multiplier;
      }

      return {
        x: roundDown(location.x - offset.x, TILE_SIZE),
        y: roundDown(location.y - offset.y, TILE_SIZE),
      };
    },
    [offset],
  );

  return (
    <Group
      x={x}
      y={y}
      ref={tileRef}
      onClick={(evt) => {
        tileRef.current?.startDrag(evt);
      }}
      onMouseEnter={setCursorWrapper("grab")}
      onDragStart={(evt) => {
        setCursor(evt, "grabbing");
        tileRef.current?.moveToTop();
      }}
      onDragEnd={(evt) => {
        setCursor(evt, "grab");
        const pointerPosition = stageRef.current?.getPointerPosition();

        if (!pointerPosition) {
          return;
        }

        if (handRectRef.current?.intersects(pointerPosition)) {
          if (position === "hand") {
            tileRef.current?.position({ x, y });
          } else {
            handleMoveTileFromBoardToHand({ x: x - offset.x, y: y - offset.y });
          }

          return;
        }

        if (position === "hand") {
          handleMoveTileFromHandToBoard(id, snapToBoard(pointerPosition));
        } else {
          const fromLocation = { x: x - offset.x, y: y - offset.y };
          const toLocation = snapToBoard(pointerPosition);

          if (
            fromLocation.x === toLocation.x &&
            fromLocation.y === toLocation.y
          ) {
            tileRef.current?.position({ x, y });
          } else {
            handleMoveTileOnBoard(fromLocation, toLocation);
          }
        }
      }}
      draggable
    >
      <Rect
        width={TILE_SIZE}
        height={TILE_SIZE}
        fill={tileBg}
        cornerRadius={5}
        stroke="black"
      />

      <Text
        text={letter}
        width={TILE_SIZE}
        height={TILE_SIZE + 1}
        fill="black"
        verticalAlign="middle"
        align="center"
        fontSize={TILE_SIZE / 2}
        fontStyle="bold"
      />
    </Group>
  );
}
