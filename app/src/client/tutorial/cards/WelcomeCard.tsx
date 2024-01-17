import { Button, Text } from "@chakra-ui/react";
import TutorialCard from "./TutorialCard";
import { useTutorial } from "@/client/tutorial/TutorialContext";

export default function WelcomeCard(): JSX.Element {
  const { goToNextStep } = useTutorial();

  return (
    <TutorialCard title="Welcome to Bananagrams!">
      <Text>
        The objective of the game is to be the first player to use all of your
        tiles.
      </Text>

      <Button colorScheme="blue" onClick={goToNextStep}>
        Show me how
      </Button>
    </TutorialCard>
  );
}
