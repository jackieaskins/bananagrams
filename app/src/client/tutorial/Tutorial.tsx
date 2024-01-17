import { useState, useCallback } from "react";
import TutorialCompleteModal from "./TutorialCompleteModal";
import { TutorialContext, TutorialStep } from "./TutorialContext";
import TutorialGameProvider from "./TutorialGameProvider";
import GameRedesign from "@/client/redesign/GameRedesign";

export default function Tutorial(): JSX.Element {
  const [activeStep, setActiveStep] = useState<TutorialStep>(0);

  const goToNextStep = useCallback(() => {
    setActiveStep((step) => step + 1);
  }, []);

  return (
    <TutorialContext.Provider value={{ activeStep, goToNextStep }}>
      <TutorialGameProvider>
        <GameRedesign />
        <TutorialCompleteModal />
      </TutorialGameProvider>
    </TutorialContext.Provider>
  );
}
