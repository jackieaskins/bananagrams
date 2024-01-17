import { Button, ListItem, OrderedList, Text } from "@chakra-ui/react";
import TutorialCard from "./TutorialCard";
import { useTutorial } from "@/client/tutorial/TutorialContext";

export default function MiscCard(): JSX.Element {
  const { goToNextStep } = useTutorial();

  return (
    <TutorialCard title="Miscellaneous actions">
      <Text>Nice! Your new tiles are better, but first:</Text>

      <OrderedList>
        <ListItem>
          If you find yourself running out of room, you can drag the board
          around. See what happens if your tiles go fully off-screen.
        </ListItem>

        <ListItem>
          Use the sidebar on the right to see how other players are doing. You
          should see what that robot is up to...
        </ListItem>
      </OrderedList>

      <Button onClick={goToNextStep} colorScheme="blue">
        Okay, I&apos;m ready to win
      </Button>
    </TutorialCard>
  );
}
