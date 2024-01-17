import { Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { TutorialStep, useTutorial } from "@/client/tutorial/TutorialContext";

type TutorialCardProps = {
  action?: string;
  children: React.ReactNode;
  title: string;
};

const STEP_COUNT = Object.values(TutorialStep).length / 2;

export default function TutorialCard({
  action,
  children,
  title,
}: TutorialCardProps): JSX.Element | null {
  const { activeStep } = useTutorial();

  if (activeStep == null) return null;

  return (
    <Card position="fixed" top={4} left={4} width="450px">
      <CardBody as={Stack} spacing={5}>
        <Heading size="md">{title}</Heading>

        {children}

        {action && <Text as="b">Action: {action}</Text>}

        <Text fontSize="sm" textAlign="end">
          Tutorial step: {activeStep + 1} / {STEP_COUNT}
        </Text>
      </CardBody>
    </Card>
  );
}
