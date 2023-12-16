import { Card, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { FaShuffle } from "react-icons/fa6";
import { Hand as HandType } from "../../types/hand";
import { ClientToServerEventName } from "../../types/socket";
import { useGame } from "../games/GameContext";
import { socket } from "../socket";
import Tile from "../tiles/Tile";
import { TileItem } from "../tiles/types";

type HandProps = {
  hand: HandType;
};

const DEFAULT_BOARD_LENGTH = 21;

export default function Hand({ hand }: HandProps): JSX.Element {
  const { handleMoveTileFromBoardToHand } = useGame();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "TILE",
    canDrop: ({ boardLocation }: TileItem, monitor) =>
      monitor.isOver() && !!boardLocation,
    drop: ({ boardLocation }: TileItem) => {
      if (boardLocation) {
        handleMoveTileFromBoardToHand(boardLocation);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Card variant="outline">
      <Tooltip label="Shuffle hand" hasArrow>
        <IconButton
          aria-label="Shuffle hand"
          icon={<FaShuffle />}
          isDisabled={hand.length <= 1}
          onClick={(): void => {
            socket.emit(ClientToServerEventName.ShuffleHand, null);
          }}
        />
      </Tooltip>

      <Flex
        ref={dropRef}
        wrap="wrap"
        direction="column"
        height={`${25 * DEFAULT_BOARD_LENGTH - 40}px`}
        minWidth="78px"
        p={1}
        backgroundColor={isOver && canDrop ? "green.700" : undefined}
      >
        {hand.map((tile) => (
          <Tile key={tile.id} tile={tile} boardLocation={null} />
        ))}
      </Flex>
    </Card>
  );
}
