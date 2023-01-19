import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AllEditorSections, IEditorSectionsStep } from "./steps";
import { IEditedVaultDescription } from "./types";

export const useVaultEditorSteps = (formMethods: UseFormReturn<IEditedVaultDescription>) => {
  const [editorSteps, setEditorSteps] = useState(AllEditorSections);
  const [currentSection, setCurrentSection] = useState<keyof typeof editorSteps>("setup");
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);
  const [maxStep, setMaxStep] = useState<number>(0);

  const currentSectionInfo = editorSteps[currentSection];
  const currentStepInfo = currentSectionInfo["steps"][currentStepNumber];

  useEffect(() => {
    initFormSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function will go through all the steps and check if they are valid or not
  const initFormSteps = async () => {
    // Get all the fields from all the sections (setup/deploy)
    const allSteps: (IEditorSectionsStep & { section: string; index: number })[] = [];

    for (const section in editorSteps) {
      const sectionSteps = editorSteps[section]["steps"];
      const sectionStepsWithExtraData = sectionSteps.map((step, index) => ({ ...step, section, index }));
      allSteps.push(...sectionStepsWithExtraData);
    }

    let firstInvalidStep = allSteps.slice(-1)[0];

    for (const step of allSteps) {
      const isValid = await formMethods.trigger(step.formFields as any);

      if (!isValid) {
        firstInvalidStep = step;
        break;
      } else {
        const newSteps = { ...editorSteps };
        newSteps[step.section]["steps"][step.index].isValid = true;
        setEditorSteps(newSteps);
      }
    }

    setCurrentSection(firstInvalidStep.section);
    setCurrentStepNumber(firstInvalidStep.index);
    setMaxStep(firstInvalidStep.index);

    // Reset the form in order to delete all the validations made by the trigger
    formMethods.reset();
  };

  const onChangeCurrentStepNumber = async (stepNumber: number) => {
    // If the user is going back or is going to a valid step, continue
    if (currentStepNumber >= stepNumber || currentSectionInfo["steps"][stepNumber].isValid) {
      setCurrentStepNumber(stepNumber);
    } else {
      const userWantsToGoToNextStep = currentStepNumber + 1 === stepNumber;
      const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);

      // The user only can go to exactly the next step
      if (isStepValid && userWantsToGoToNextStep) {
        setMaxStep(stepNumber);
        setCurrentStepNumber(stepNumber);
      }
    }
  };

  return {
    steps: currentSectionInfo.steps,
    currentStepInfo,
    onChangeCurrentStepNumber,
    maxStep,
  };
};
