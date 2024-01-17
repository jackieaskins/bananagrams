import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import TutorialCard from "./TutorialCard";
import { useCurrentPlayer } from "@/client/redesign/useCurrentPlayer";
import { useTutorial } from "@/client/tutorial/TutorialContext";

export default function FirstPeelCard(): JSX.Element {
  const { goToNextStep } = useTutorial();
  const { hand } = useCurrentPlayer();

  useEffect(() => {
    if (hand?.[0]?.letter === "Z") {
      goToNextStep();
    }
  }, [goToNextStep, hand]);

  return (
    <TutorialCard title="First peel" action="Click the Peel button below.">
      <Text>
        Now that your hand is empty and your board is valid, you can peel.
        Peeling will give you and every other player in the game a new tile.
      </Text>

      <Text>
        The game will continue this way until there aren&apos;t enough remaining
        tiles in the bunch for every player. You can see the number of tiles in
        the bunch at the bottom of the screen.
      </Text>
    </TutorialCard>
  );
}
