import { Box, Text } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Tile as TileType } from "@/types/tile";

type TileProps = {
  boardLocation: { x: number; y: number } | null;
  tile: TileType;
  color?: string;
};

export default function Tile({
  boardLocation,
  tile: { id, letter },
  color = "black",
}: TileProps): JSX.Element {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "TILE", id, boardLocation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const margin = boardLocation ? "0" : "5px";

  return (
    <Box
      ref={dragRef}
      alignItems="center"
      backgroundColor="yellow.100"
      border="1px"
      borderColor={color}
      borderRadius="5px"
      color={color}
      cursor="move"
      display="inline-flex"
      height="25px"
      justifyContent="center"
      margin={margin}
      opacity={isDragging ? 0.5 : 1}
      width="25px"
    >
      <Text as="b">{letter}</Text>
    </Box>
  );
}
