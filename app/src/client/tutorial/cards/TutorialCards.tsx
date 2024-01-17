import BoardValidationCard from "./BoardValidationCard";
import DumpCard from "./DumpCard";
import FirstPeelCard from "./FirstPeelCard";
import MiscCard from "./MiscCard";
import MoveFirstTileCard from "./MoveFirstTileCard";
import WelcomeCard from "./WelcomeCard";
import WinGameCard from "./WinGameCard";
import { SetState } from "@/client/state/types";
import { TutorialStep, useTutorial } from "@/client/tutorial/TutorialContext";
import { Player } from "@/types/player";

type TutorialCardsProps = {
  setCurrentPlayer: SetState<Player>;
};

export default function TutorialCards({
  setCurrentPlayer,
}: TutorialCardsProps): JSX.Element | null {
  const { activeStep } = useTutorial();

  const cards: Record<TutorialStep, JSX.Element> = {
    [TutorialStep.WELCOME]: <WelcomeCard />,
    [TutorialStep.MOVE_FIRST_TILE]: (
      <MoveFirstTileCard setCurrentPlayer={setCurrentPlayer} />
    ),
    [TutorialStep.BOARD_VALIDATION]: (
      <BoardValidationCard setCurrentPlayer={setCurrentPlayer} />
    ),
    [TutorialStep.FIRST_PEEL]: <FirstPeelCard />,
    [TutorialStep.DUMP]: <DumpCard />,
    [TutorialStep.MISC]: <MiscCard />,
    [TutorialStep.WIN_GAME]: <WinGameCard />,
  };

  if (activeStep == null) {
    return null;
  }

  return cards[activeStep];
}
