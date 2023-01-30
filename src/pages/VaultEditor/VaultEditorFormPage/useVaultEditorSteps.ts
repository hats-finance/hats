import { useCallback, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AllEditorSections, IEditorSectionsStep } from "./steps";
import { IEditedVaultDescription } from "types";

export const useVaultEditorSteps = (
  formMethods: UseFormReturn<IEditedVaultDescription>,
  options: {
    saveData?: () => Promise<void>;
    executeOnSaved?: (section: keyof typeof AllEditorSections, step: number) => void;
  }
) => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const isAdvancedMode = searchParams.get("mode")?.includes("advanced") ?? false;

  const [editorSections, setEditorSections] = useState(AllEditorSections);
  const [currentSection, setCurrentSection] = useState<keyof typeof AllEditorSections>("setup");
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);
  const [loadingSteps, setLoadingSteps] = useState(false);

  const currentSectionInfo = editorSections[currentSection];
  const currentStepInfo = currentSectionInfo["steps"][currentStepNumber];

  useEffect(() => {
    // Remove advanced steps if not in advanced mode
    if (!isAdvancedMode) {
      setEditorSections((currentSections) => {
        const sections = { ...currentSections };

        for (const section in sections) {
          const sectionSteps = sections[section]["steps"];
          const sectionStepsFiltered = sectionSteps.filter((step) => !step.isAdvanced);
          sections[section]["steps"] = sectionStepsFiltered;
        }

        return sections;
      });
    }
  }, [isAdvancedMode]);

  const allSteps = useMemo(() => {
    // Get all the fields from all the sections (setup/deploy)
    const steps: (IEditorSectionsStep & { section: string; index: number })[] = [];

    for (const section in editorSections) {
      const sectionSteps = editorSections[section]["steps"];
      const sectionStepsWithExtraData = sectionSteps.map((step, index) => ({ ...step, section, index }));

      steps.push(...sectionStepsWithExtraData);
    }

    return steps;
  }, [editorSections]);

  const editStepStatus = useCallback(
    async (
      property: "isValid" | "isChecked",
      value: boolean = true,
      step: number = currentStepNumber,
      section: keyof typeof editorSections = currentSection
    ) => {
      const newSteps = { ...editorSections };
      newSteps[section]["steps"][step][property] = value;
      setEditorSections(newSteps);
    },
    [currentSection, currentStepNumber, editorSections]
  );

  // This function will go through all the steps and check if they are valid or not
  const initFormSteps = async () => {
    setLoadingSteps(true);
    let firstInvalidStep = allSteps[0];

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

    // Reset the form in order to delete all the validations made by the trigger
    formMethods.reset();
    setLoadingSteps(false);
  };

  const revalidateStep = async (stepNumber: number, section: keyof typeof AllEditorSections) => {
    const isStepValid = await formMethods.trigger(editorSections[section].steps[stepNumber].formFields as any);
    editStepStatus("isValid", isStepValid, stepNumber, section);
  };

  const onGoToSection = async (sectionId: keyof typeof AllEditorSections) => {
    const currentSectionIdx = Object.keys(editorSections).indexOf(`${currentSection}`);
    const desiredSectionIdx = Object.keys(editorSections).indexOf(`${sectionId}`);

    const userWantsToGoBack = desiredSectionIdx < currentSectionIdx;
    const isCurrentSectionValid = currentSectionInfo.steps.every((step) => step.isValid);

    if (isCurrentSectionValid || userWantsToGoBack) {
      setCurrentSection(sectionId);
      setCurrentStepNumber(0);
    }
  };

  const onGoToStep = async (stepNumber: number) => {
    const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);
    // const isStepValid = true;

    // If the user is going back or is going to a valid step, continue
    if (currentStepNumber >= stepNumber) {
      editStepStatus("isValid", isStepValid);
      setCurrentStepNumber(stepNumber);
    } else {
      const userWantsToGoToNextStep = currentStepNumber + 1 === stepNumber;

      if (isStepValid) {
        if (options.saveData)
          options.saveData().then(() => {
            if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
          });

        if (userWantsToGoToNextStep) {
          editStepStatus("isValid", true);
          editStepStatus("isChecked", true, stepNumber);

          setCurrentStepNumber(stepNumber);
        } else {
          // If the user is going to a step that is not the next one, we need to check the previous steps
          const previousSteps = editorSections[currentSection]["steps"].slice(0, stepNumber);
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

  const onGoBack = useMemo((): { go: Function; text: string } | undefined => {
    const sectionsNames = Object.keys(editorSections);
    const currentSectionIndex = sectionsNames.indexOf(`${currentSection}`);
    const isInFirstSection = currentSectionIndex === 0;
    const isInFirstStep = currentStepNumber === 0;

    // If the user is in the first step of the first section, cant go back
    if (isInFirstSection && isInFirstStep) return undefined;

    // If the user is in the first step of a section, go back to the previous section
    if (isInFirstStep) {
      const previousSection = sectionsNames[currentSectionIndex - 1];
      const previousSectionSteps = editorSections[previousSection]["steps"];
      const previousSectionLastStepIndex = previousSectionSteps.length - 1;

      return {
        go: async () => {
          const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);
          editStepStatus("isValid", isStepValid);

          setCurrentSection(previousSection);
          setCurrentStepNumber(previousSectionLastStepIndex);
        },
        text: t("back"),
      };
    }

    // If the user is in any other step, go back to the previous step
    return {
      go: async () => {
        const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);
        editStepStatus("isValid", isStepValid);

        setCurrentStepNumber(currentStepNumber - 1);
      },
      text: t("back"),
    };
  }, [currentSection, currentStepInfo.formFields, currentStepNumber, editStepStatus, editorSections, formMethods, t]);

  const onGoNext = useMemo((): { go: Function; text: string } => {
    const sectionsNames = Object.keys(editorSections);
    const currentSectionIndex = sectionsNames.indexOf(`${currentSection}`);
    const isInLastSection = currentSectionIndex === sectionsNames.length - 1;
    const isInLastStep = currentStepNumber === currentSectionInfo["steps"].length - 1;
    const currentStep = currentSectionInfo["steps"][currentStepNumber];

    // If the user is in the last step of the last section, submit the form
    if (isInLastSection && isInLastStep) {
      return {
        go: () => {
          if (options.saveData) formMethods.handleSubmit(options.saveData)();
        },
        text: t(currentStep.nextButtonTextKey ?? "next"),
      };
    }

    // If the user is in the last step of a section, go to the next section
    if (isInLastStep) {
      const nextSection = sectionsNames[currentSectionIndex + 1];

      return {
        go: async () => {
          const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);
          if (isStepValid) {
            if (options.saveData)
              options.saveData().then(() => {
                if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
              });

            editStepStatus("isValid", true);
            editStepStatus("isChecked", true, 0, nextSection);

            setCurrentSection(nextSection);
            setCurrentStepNumber(0);
          }
        },
        text: t(currentStep.nextButtonTextKey ?? "next"),
      };
    }

    // If the user is in any other step, go to the next step
    return {
      go: async () => {
        const isStepValid = await formMethods.trigger(currentStepInfo.formFields as any);
        if (isStepValid) {
          if (options.saveData)
            options.saveData().then(() => {
              if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
            });

          editStepStatus("isValid", true);
          editStepStatus("isChecked", true, currentStepNumber + 1);

          setCurrentStepNumber(currentStepNumber + 1);
        }
      },
      text: t(currentStep.nextButtonTextKey ?? "next"),
    };
  }, [
    currentSection,
    currentStepNumber,
    editorSections,
    currentSectionInfo,
    currentStepInfo,
    formMethods,
    editStepStatus,
    options,
    t,
  ]);

  return {
    steps: currentSectionInfo.steps,
    sections: Object.values(editorSections),
    currentSectionInfo,
    currentStepInfo,
    onGoToStep,
    onGoBack,
    onGoNext,
    onGoToSection,
    initFormSteps,
    loadingSteps,
    revalidateStep,
  };
};
