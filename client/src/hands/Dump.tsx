import { Card, CardBody, Text } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { useGame } from "../games/GameContext";
import { TileItem } from "../tiles/types";

const EXCHANGE_COUNT = 3;

export default function Dump(): JSX.Element {
  const {
    gameInfo: { bunch },
    handleDump,
  } = useGame();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "TILE",
    canDrop: () => bunch.length >= EXCHANGE_COUNT,
    drop: (tileItem: TileItem) => {
      handleDump(tileItem);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Card
      variant="outline"
      backgroundColor={isOver ? (canDrop ? "green.700" : "red.700") : undefined}
      ref={dropRef}
    >
      <CardBody textAlign="center" color="gray.500" width="fit-content">
        <Text>Dump!</Text>
        <Text>
          Drag a tile here to exchange it for {EXCHANGE_COUNT} from the bunch
        </Text>
      </CardBody>
    </Card>
  );
}
