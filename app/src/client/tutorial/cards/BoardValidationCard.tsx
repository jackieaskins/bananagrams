import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import TutorialCard from "./TutorialCard";
import { useCurrentPlayer } from "@/client/redesign/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import { useTutorial } from "@/client/tutorial/TutorialContext";
import { ValidationStatus } from "@/types/board";
import { Player } from "@/types/player";

type BoardValidationProps = {
  setCurrentPlayer: SetState<Player>;
};

export default function BoardValidationCard({
  setCurrentPlayer,
}: BoardValidationProps): JSX.Element {
  const { goToNextStep } = useTutorial();
  const { board } = useCurrentPlayer();

  useEffect(() => {
    setCurrentPlayer((player) => ({
      ...player,
      hand: [{ id: "D1", letter: "D" }],
    }));
  }, [setCurrentPlayer]);

  useEffect(() => {
    const boardSquares = Object.values(board);
    if (
      boardSquares.length === 2 &&
      boardSquares.every(({ wordInfo }) =>
        Object.values(wordInfo).every(
          ({ validation }) => validation !== ValidationStatus.INVALID,
        ),
      )
    ) {
      goToNextStep();
    }
  }, [board, goToNextStep]);

  return (
    <TutorialCard
      title="Board validation"
      action="Move the 'D' onto the board to play 'DA'. See how the colors change to red. Then switch to 'AD'."
    >
      <Text>
        The game will validate tiles as you place them. Valid words will turn
        green while invalid ones will be red. Words can be made in a vertical or
        horizontal direction.
      </Text>
    </TutorialCard>
  );
}
