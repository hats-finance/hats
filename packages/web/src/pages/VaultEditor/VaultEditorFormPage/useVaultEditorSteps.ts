import { useCallback, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { AllEditorSections, IEditorSectionsStep } from "./steps";
import { IEditedVaultDescription } from "types";

export const useVaultEditorSteps = (
  formMethods: UseFormReturn<IEditedVaultDescription>,
  options: {
    saveData?: () => Promise<void>;
    executeOnSaved?: (section: keyof typeof AllEditorSections, step: number) => void;
    onFinalSubmit?: () => void;
    onFinalEditSubmit?: () => void;
  }
) => {
  const { t } = useTranslation();

  const { editSessionId } = useParams();
  const [searchParams] = useSearchParams();
  const isAdvancedMode = searchParams.get("mode")?.includes("advanced") ?? false;

  const [isEditingExistingVault, setIsEditingExistingVault] = useState(false);

  const [editorSections, setEditorSections] = useState(AllEditorSections);
  const [currentSection, setCurrentSection] = useState<keyof typeof AllEditorSections>("setup");
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);
  const [loadingSteps, setLoadingSteps] = useState(false);

  const currentSectionInfo = editorSections[currentSection] ? editorSections[currentSection] : undefined;
  const currentStepInfo = currentSectionInfo ? currentSectionInfo["steps"][currentStepNumber] : undefined;

  useEffect(() => {
    // Remove advanced steps if not in advanced mode
    if (!isAdvancedMode) {
      setEditorSections((currentSections) => {
        for (const section in currentSections) {
          const sectionSteps = currentSections[section]["steps"];
          const sectionStepsFiltered = sectionSteps.filter((step) => !step.isAdvanced);
          currentSections[section]["steps"] = sectionStepsFiltered;
        }

        return currentSections;
      });
    }

    // Remove only creator sections if editing an existing vault
    if (isEditingExistingVault) {
      setEditorSections((currentSections) => {
        const newSections = {};

        for (const section in currentSections) {
          if (!currentSections[section].onlyInCreation) newSections[section] = { ...currentSections[section] };
        }

        return newSections;
      });
    }
  }, [isAdvancedMode, editSessionId, isEditingExistingVault]);

  const allSteps = useMemo(() => {
    // Get all the fields from all the sections (setup/deploy)
    const steps: (IEditorSectionsStep & { section: string; index: number; onlyCreation: boolean })[] = [];

    for (const section in editorSections) {
      const sectionSteps = editorSections[section]["steps"];
      const sectionStepsWithExtraData = sectionSteps.map((step, index) => ({
        ...step,
        section,
        index,
        onlyCreation: editorSections[section].onlyInCreation ?? false,
      }));

      steps.push(...sectionStepsWithExtraData);
    }

    return steps;
  }, [editorSections]);

  const editStepStatus = useCallback(
    async (property: "isValid" | "isChecked", value: boolean = true, step: number, section: keyof typeof editorSections) => {
      setEditorSections((currentSections) => {
        if (currentSections[section] && currentSections[section]["steps"][step]) {
          currentSections[section]["steps"][step][property] = value;
        }
        return currentSections;
      });
    },
    []
  );

  // This function will go through all the steps and check if they are valid or not
  const initFormSteps = useCallback(async () => {
    setLoadingSteps(true);
    let firstInvalidStep: (IEditorSectionsStep & { section: string; index: number }) | undefined;

    for (const step of allSteps) {
      const isValid = await formMethods.trigger(step.formFields as any);

      if (firstInvalidStep) {
        editStepStatus("isChecked", false, step.index, step.section);
        editStepStatus("isValid", false, step.index, step.section);
        continue;
      }

      if (!isValid) {
        firstInvalidStep = step;
        editStepStatus("isChecked", true, step.index, step.section);
        editStepStatus("isValid", false, step.index, step.section);
        continue;
      } else {
        editStepStatus("isValid", true, step.index, step.section);
        editStepStatus("isChecked", true, step.index, step.section);
      }
    }

    if (!firstInvalidStep) firstInvalidStep = allSteps[0];

    setCurrentSection(firstInvalidStep.section);
    setCurrentStepNumber(firstInvalidStep.index);

    // Reset the form in order to delete all the validations made by the trigger
    formMethods.reset();
    setLoadingSteps(false);
  }, [allSteps, editStepStatus, formMethods]);

  const revalidateStep = async (stepNumber: number, section: keyof typeof AllEditorSections) => {
    const isStepValid = await formMethods.trigger(editorSections[section].steps[stepNumber].formFields as any);
    editStepStatus("isValid", isStepValid, stepNumber, section);
  };

  const onGoToSection = async (sectionId: keyof typeof AllEditorSections) => {
    const currentSectionIdx = Object.keys(editorSections).indexOf(`${currentSection}`);
    const desiredSectionIdx = Object.keys(editorSections).indexOf(`${sectionId}`);

    if (currentSectionIdx === desiredSectionIdx) return;

    const userWantsToGoBack = desiredSectionIdx < currentSectionIdx;
    const isCurrentSectionValid = currentSectionInfo?.steps.every((step) => step.isValid);

    if (isCurrentSectionValid || userWantsToGoBack) {
      setCurrentSection(sectionId);
      setCurrentStepNumber(0);

      if (options.saveData)
        options.saveData().then(() => {
          if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
        });
    }
  };

  const onGoToStep = async (stepNumber: number) => {
    const isStepValid = await formMethods.trigger(currentStepInfo?.formFields as any);

    // If the user is going back, continue
    if (currentStepNumber >= stepNumber) {
      editStepStatus("isValid", isStepValid, currentStepNumber, currentSection);
      setCurrentStepNumber(stepNumber);

      if (options.saveData)
        options.saveData().then(() => {
          if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
        });
    } else {
      const userWantsToGoToNextStep = currentStepNumber + 1 === stepNumber;

      if (isStepValid) {
        if (options.saveData)
          options.saveData().then(() => {
            if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
          });

        if (userWantsToGoToNextStep) {
          editStepStatus("isValid", true, currentStepNumber, currentSection);
          editStepStatus("isChecked", true, stepNumber, currentSection);

          setCurrentStepNumber(stepNumber);
        } else {
          // If the user is going to a step that is not the next one, we need to check the previous steps
          const previousSteps = editorSections[currentSection]["steps"].slice(0, stepNumber);
          const previousStepsValid = previousSteps.every((step) => step.isValid);
          const previousStepsChecked = previousSteps.every((step) => step.isChecked);

          if (previousStepsValid && previousStepsChecked) {
            editStepStatus("isChecked", true, stepNumber, currentSection);
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
          const isStepValid = await formMethods.trigger(currentStepInfo?.formFields as any);
          editStepStatus("isValid", isStepValid, currentStepNumber, currentSection);

          if (options.saveData)
            options.saveData().then(() => {
              if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
            });

          setCurrentSection(previousSection);
          setCurrentStepNumber(previousSectionLastStepIndex);
        },
        text: t("back"),
      };
    }

    // If the user is in any other step, go back to the previous step
    return {
      go: async () => {
        const isStepValid = await formMethods.trigger(currentStepInfo?.formFields as any);
        editStepStatus("isValid", isStepValid, currentStepNumber, currentSection);

        setCurrentStepNumber(currentStepNumber - 1);
      },
      text: t("back"),
    };
  }, [currentSection, currentStepInfo?.formFields, currentStepNumber, editStepStatus, editorSections, formMethods, options, t]);

  const onGoNext = useMemo((): { go: Function; text: string } => {
    if (!currentSectionInfo) return { go: () => {}, text: "" };

    const sectionsNames = Object.keys(editorSections);
    const currentSectionIndex = sectionsNames.indexOf(`${currentSection}`);
    const isInLastSection = currentSectionIndex === sectionsNames.length - 1;
    const isInLastStep = currentStepNumber === currentSectionInfo["steps"].length - 1;
    const currentStep = currentSectionInfo["steps"][currentStepNumber];

    // If the user is in the last step of the last section, submit the form
    if (isInLastSection && isInLastStep) {
      return {
        go: () => {
          if (isEditingExistingVault) {
            if (options.onFinalEditSubmit) options.onFinalEditSubmit();
          } else {
            if (options.onFinalSubmit) formMethods.handleSubmit(options.onFinalSubmit)();
          }
        },
        text: t(
          (isEditingExistingVault ? currentStep.nextButtonTextKey?.editing : currentStep.nextButtonTextKey?.creation) ?? "next"
        ),
      };
    }

    // If the user is in the last step of a section, go to the next section
    if (isInLastStep) {
      const nextSection = sectionsNames[currentSectionIndex + 1];

      return {
        go: async () => {
          const isStepValid = await formMethods.trigger(currentStepInfo?.formFields as any);
          if (isStepValid) {
            if (options.saveData)
              options.saveData().then(() => {
                if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
              });

            editStepStatus("isValid", true, currentStepNumber, currentSection);
            editStepStatus("isChecked", true, 0, nextSection);

            setCurrentSection(nextSection);
            setCurrentStepNumber(0);
          }
        },
        text: t(
          (isEditingExistingVault ? currentStep.nextButtonTextKey?.editing : currentStep.nextButtonTextKey?.creation) ?? "next"
        ),
      };
    }

    // If the user is in any other step, go to the next step
    return {
      go: async () => {
        const isStepValid = await formMethods.trigger(currentStepInfo?.formFields as any);
        if (isStepValid) {
          if (options.saveData)
            options.saveData().then(() => {
              if (options.executeOnSaved) options.executeOnSaved(currentSection, currentStepNumber);
            });

          editStepStatus("isValid", true, currentStepNumber, currentSection);
          editStepStatus("isChecked", true, currentStepNumber + 1, currentSection);

          setCurrentStepNumber(currentStepNumber + 1);
        }
      },
      text: t(
        (isEditingExistingVault ? currentStep.nextButtonTextKey?.editing : currentStep.nextButtonTextKey?.creation) ?? "next"
      ),
    };
  }, [
    currentSection,
    currentStepNumber,
    editorSections,
    currentSectionInfo,
    currentStepInfo,
    formMethods,
    editStepStatus,
    isEditingExistingVault,
    options,
    t,
  ]);

  return {
    steps: currentSectionInfo?.steps ?? [],
    sections: Object.values(editorSections),
    presetIsEditingExistingVault: setIsEditingExistingVault,
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
