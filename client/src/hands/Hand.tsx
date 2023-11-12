import { Shuffle } from "@mui/icons-material";
import { Box, Button, Divider, Tooltip } from "@mui/material";
import { useDrop } from "react-dnd";
import { useGame } from "../games/GameContext";
import TransparentPaper from "../paper/TransparentPaper";
import { useSocket } from "../socket/SocketContext";
import { validDropSx } from "../styles";
import Tile from "../tiles/Tile";
import { TileItem } from "../tiles/types";
import { Hand as HandType } from "./types";

type HandProps = {
  hand: HandType;
};

const DEFAULT_BOARD_LENGTH = 21;

const Hand: React.FC<HandProps> = ({ hand }) => {
  const { socket } = useSocket();
  const {
    gameInfo: { players },
    handleMoveTileFromBoardToHand,
  } = useGame();
  const boardLength =
    players.find((player) => player.userId === socket.id)?.board?.length ??
    DEFAULT_BOARD_LENGTH;

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "TILE",
    canDrop: ({ boardLocation }: TileItem, monitor) =>
      monitor.isOver() && !!boardLocation,
    drop: ({ boardLocation }: TileItem) => {
      handleMoveTileFromBoardToHand(boardLocation);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <TransparentPaper>
      <Tooltip title="Shuffle hand">
        <Button
          sx={{ width: "100%" }}
          disabled={hand.length <= 1}
          size="small"
          onClick={(): void => {
            socket.emit("shuffleHand", {});
          }}
        >
          <Shuffle color="action" fontSize="small" />
        </Button>
      </Tooltip>

      <Divider />

      <Box
        ref={dropRef}
        display="flex"
        flexWrap="wrap"
        flexDirection="column"
        height={`${25 * boardLength - 28}px`}
        p={1}
        sx={isOver && canDrop ? validDropSx : null}
      >
        {hand.map((tile) => (
          <Tile key={tile.id} tile={tile} boardLocation={null} />
        ))}
      </Box>
    </TransparentPaper>
  );
};

export default Hand;
