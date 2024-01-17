import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import TutorialCard from "./TutorialCard";
import { useCurrentPlayer } from "@/client/redesign/useCurrentPlayer";
import { useTutorial } from "@/client/tutorial/TutorialContext";

export default function DumpCard(): JSX.Element {
  const { goToNextStep } = useTutorial();
  const { hand } = useCurrentPlayer();

  useEffect(() => {
    const handLetters = hand.map(({ letter }) => letter);
    if (
      handLetters.includes("R") &&
      handLetters.includes("T") &&
      handLetters.includes("S")
    ) {
      goToNextStep();
    }
  }, [goToNextStep, hand]);

  return (
    <TutorialCard
      title="Dump a tile"
      action="Move the 'Z' tile to the area labeled Dump."
    >
      <Text>
        Z is a tough letter to get! If you get a tile that you don&apos;t want,
        you can dump it. This will exchange your tile with 3 new ones from the
        bunch.
      </Text>

      <Text>
        There isn&apos;t a limit to the number of times you can dump, but you
        can only do it if there are at least 3 tiles remaining in the bunch.
      </Text>
    </TutorialCard>
  );
}
