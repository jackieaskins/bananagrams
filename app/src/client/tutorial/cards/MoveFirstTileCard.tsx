import { ListItem, OrderedList, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import TutorialCard from "./TutorialCard";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import { useTutorial } from "@/client/tutorial/TutorialContext";
import { Player } from "@/types/player";
import { Tile } from "@/types/tile";

type MoveFirstTileCardProps = {
  setCurrentPlayer: SetState<Player>;
};

const STARTING_TILE: Tile = { id: "A1", letter: "A" };

export default function MoveFirstTileCard({
  setCurrentPlayer,
}: MoveFirstTileCardProps): JSX.Element {
  const { goToNextStep } = useTutorial();
  const { board } = useCurrentPlayer();

  useEffect(() => {
    setCurrentPlayer((player) => ({ ...player, hand: [STARTING_TILE] }));
  }, [setCurrentPlayer]);

  useEffect(() => {
    if (Object.values(board).some(({ tile }) => tile.id === STARTING_TILE.id)) {
      goToNextStep();
    }
  }, [board, goToNextStep]);

  return (
    <TutorialCard
      title="Move a tile to your board"
      action={`Use one of the two methods to move the '${STARTING_TILE.letter}' tile onto the grid.`}
    >
      <Text>
        Below you have the &#39;{STARTING_TILE.letter}&#39; tile in your hand.
        There are two ways to move a tile:
      </Text>

      <OrderedList>
        <ListItem>Dragging it between locations</ListItem>

        <ListItem>
          Clicking to select it and then clicking the destination
        </ListItem>
      </OrderedList>
    </TutorialCard>
  );
}
