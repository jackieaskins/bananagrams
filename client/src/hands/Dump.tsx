import { Box, Typography } from "@mui/material";
import { useDrop } from "react-dnd";
import { useGame } from "../games/GameContext";
import TransparentPaper from "../paper/TransparentPaper";
import { invalidDropSx, validDropSx } from "../styles";
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
    <TransparentPaper sx={{ width: "100%" }}>
      <Box
        ref={dropRef}
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        justifyContent="center"
        sx={isOver ? (canDrop ? validDropSx : invalidDropSx) : undefined}
      >
        <Typography variant="button" color="textSecondary">
          Dump!
        </Typography>
        {bunch.length >= EXCHANGE_COUNT && (
          <Typography variant="caption" color="textSecondary">
            Drag a tile here to exchange it for {EXCHANGE_COUNT} from the bunch
          </Typography>
        )}
      </Box>
    </TransparentPaper>
  );
}
