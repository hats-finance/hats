import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AllEditorSections, IEditorSectionsStep } from "./steps";
import { IEditedVaultDescription } from "./types";

export const useVaultEditorSteps = (formMethods: UseFormReturn<IEditedVaultDescription>) => {
  const [editorSteps, setEditorSteps] = useState(AllEditorSections);
  const [currentSection, setCurrentSection] = useState<keyof typeof AllEditorSections>("setup");
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);
  const [maxStep, setMaxStep] = useState<number>(0);

  const currentSectionInfo = editorSteps[currentSection];
  const currentStepInfo = currentSectionInfo["steps"][currentStepNumber];

  useEffect(() => {
    console.log(1);
    initFormSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allSteps = useMemo(() => {
    // Get all the fields from all the sections (setup/deploy)
    const steps: (IEditorSectionsStep & { section: string; index: number })[] = [];

    for (const section in editorSteps) {
      const sectionSteps = editorSteps[section]["steps"];
      const sectionStepsWithExtraData = sectionSteps.map((step, index) => ({ ...step, section, index }));
      steps.push(...sectionStepsWithExtraData);
    }

    return steps;
  }, [editorSteps]);

  // This function will go through all the steps and check if they are valid or not
  const initFormSteps = async () => {
    let firstInvalidStep = allSteps.slice(-1)[0];

    for (const step of allSteps) {
      const isValid = await formMethods.trigger(step.formFields as any);

      if (!isValid) {
        firstInvalidStep = step;
        editStepStatus("isChecked", true, step.index, step.section);
        break;
      } else {
        editStepStatus("isValid", true, step.index, step.section);
        editStepStatus("isChecked", true, step.index, step.section);
      }
    }

    setCurrentSection(firstInvalidStep.section);
    setCurrentStepNumber(firstInvalidStep.index);
    setMaxStep(firstInvalidStep.index);

    // Reset the form in order to delete all the validations made by the trigger
    formMethods.reset();
  };

  const editStepStatus = async (
    property: "isValid" | "isChecked",
    value: boolean = true,
    step: number = currentStepNumber,
    section: keyof typeof editorSteps = currentSection
  ) => {
    const newSteps = { ...editorSteps };
    newSteps[section]["steps"][step][property] = value;
    setEditorSteps(newSteps);
  };

  const onChangeCurrentStepNumber = async (stepNumber: number) => {
    const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);

    // If the user is going back or is going to a valid step, continue
    if (currentStepNumber >= stepNumber) {
      editStepStatus("isValid", isStepValid);
      setCurrentStepNumber(stepNumber);
    } else {
      const userWantsToGoToNextStep = currentStepNumber + 1 === stepNumber;

      if (isStepValid) {
        if (userWantsToGoToNextStep) {
          editStepStatus("isValid", true);
          editStepStatus("isChecked", true, stepNumber);

          setCurrentStepNumber(stepNumber);
        } else {
          // If the user is going to a step that is not the next one, we need to check the previous steps
          const previousSteps = editorSteps[currentSection]["steps"].slice(0, stepNumber);
          console.log(previousSteps);
          const previousStepsValid = previousSteps.every((step) => step.isValid);
          const previousStepsChecked = previousSteps.every((step) => step.isChecked);

          if (previousStepsValid && previousStepsChecked) {
            editStepStatus("isChecked", true, stepNumber);

            setCurrentStepNumber(stepNumber);
          }
        }
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
