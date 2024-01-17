import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import TutorialCard from "./TutorialCard";
import { useGame } from "@/client/games/GameContext";
import { useTutorial } from "@/client/tutorial/TutorialContext";

export default function WinGameCard(): JSX.Element {
  const { goToNextStep } = useTutorial();
  const {
    gameInfo: { isInProgress },
  } = useGame();

  useEffect(() => {
    if (!isInProgress) {
      goToNextStep();
    }
  }, [goToNextStep, isInProgress]);

  return (
    <TutorialCard
      title="Time to win!"
      action="Click the Bananas button once you've played all your tiles."
    >
      <Text>
        Okay, time to finish this up. You may have noticed that the Peel button
        has changed to Bananas. This means your next peel will win the game.
      </Text>

      <Text>
        Play your remaining tiles! There are a couple of valid words, but if you
        can&apos;t think of one: play ARTS on the existing A.
      </Text>
    </TutorialCard>
  );
}
