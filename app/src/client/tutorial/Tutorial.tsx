import { useState, useCallback } from "react";
import TutorialCompleteModal from "./TutorialCompleteModal";
import { TutorialContext, TutorialStep } from "./TutorialContext";
import TutorialGameProvider from "./TutorialGameProvider";
import Game from "@/client/games/Game";

export default function Tutorial(): JSX.Element {
  const [activeStep, setActiveStep] = useState<TutorialStep>(0);

  const goToNextStep = useCallback(() => {
    setActiveStep((step) => step + 1);
  }, []);

  return (
    <TutorialContext.Provider value={{ activeStep, goToNextStep }}>
      <TutorialGameProvider>
        <Game />
        <TutorialCompleteModal />
      </TutorialGameProvider>
    </TutorialContext.Provider>
  );
}
