import { createContext, useContext } from "react";

export enum TutorialStep {
  WELCOME,
  MOVE_FIRST_TILE,
  BOARD_VALIDATION,
  FIRST_PEEL,
  DUMP,
  MISC,
  WIN_GAME,
}

type TutorialState = {
  activeStep: TutorialStep | null;
  goToNextStep: () => void;
};

export const TutorialContext = createContext<TutorialState>({
  activeStep: null,
  goToNextStep: () => null,
});

export function useTutorial(): TutorialState {
  return useContext(TutorialContext);
}
