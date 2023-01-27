import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RoutePaths } from "navigation";
import { Button, Loading } from "components";
import * as VaultService from "./vaultService";
import { IEditedVaultDescription, IEditedVulnerabilitySeverityV1 } from "./types";
import { createNewCommitteeMember, createNewVaultDescription } from "./utils";
import { convertVulnerabilitySeverityV1ToV2 } from "./severities";
import { getEditedDescriptionYupSchema } from "./formSchema";
import { useVaultEditorSteps } from "./useVaultEditorSteps";
import {
  Section,
  VaultEditorForm,
  VaultEditorStepController,
  VaultEditorSectionController,
  VaultEditorStepper,
  StyledVaultEditorContainer,
} from "./styles";
import BackIcon from "@mui/icons-material/ArrowBack";
import NextIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import { AllEditorSections } from "./steps";
import { getGnosisSafeInfo } from "utils/gnosis.utils";
import { VaultEditorFormContext } from "./store";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const { editSessionId } = useParams();

  const navigate = useNavigate();

  const [loadingEditSession, setLoadingEditSession] = useState(false);

  const test = () => {
    // removeMembers();
    committeeMembersFieldArray.append(createNewCommitteeMember());
    console.log(getValues());
  };

  const methods = useForm<IEditedVaultDescription>({
    defaultValues: createNewVaultDescription("v2"),
    resolver: yupResolver(getEditedDescriptionYupSchema(t)),
    mode: "onChange",
  });

  const { formState, reset: handleReset, control, setValue, getValues } = methods;
  const committeeMembersFieldArray = useFieldArray({ control: control, name: "committee.members" });

  const {
    steps,
    sections,
    currentStepInfo,
    currentSectionInfo,
    onGoToStep,
    onGoBack,
    onGoNext,
    onGoToSection,
    initFormSteps,
    loadingSteps,
  } = useVaultEditorSteps(methods, {
    saveData: () => saveEditSessionData(),
    executeOnSaved: (sectionId, stepNumber) => {
      const committeeSectionId = "setup";
      const committeeStepId = "committee";
      const committeeStepNumber = AllEditorSections[committeeSectionId].steps.findIndex((step) => step.id === committeeStepId);

      if (sectionId === "setup" && stepNumber === committeeStepNumber) recalculateCommitteeMembers(sectionId, stepNumber);
    },
  });

  const vaultVersion = useWatch({ control, name: "version" });

  const saveEditSessionData = async () => {
    const data: IEditedVaultDescription = getValues();
    const sessionIdOrSession = await VaultService.upsertEditSession(
      data,
      editSessionId === "new-vault" ? undefined : editSessionId
    );

    if (typeof sessionIdOrSession === "string") {
      navigate(`${RoutePaths.vault_editor}/${sessionIdOrSession}`, { replace: true });
    } else {
      handleReset(sessionIdOrSession, { keepDefaultValues: true, keepErrors: true, keepDirty: true });
    }
  };

  async function loadEditSessionData(editSessionId: string) {
    try {
      setLoadingEditSession(true);

      const editSessionData = await VaultService.getEditSessionData(editSessionId);
      handleReset(editSessionData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEditSession(false);
    }
  }

  useEffect(() => {
    initFormSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingEditSession]);

  useEffect(() => {
    if (editSessionId) {
      if (editSessionId === "new-vault") {
        saveEditSessionData();
      } else {
        loadEditSessionData(editSessionId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSessionId]);

  useEffect(() => {
    const dirtyFields = Object.keys(formState.dirtyFields);
    if (!dirtyFields.includes("version")) return;

    const onlyVersionDirty = dirtyFields.length === 1 && dirtyFields[0] === "version";

    // If it's a new and clean form description in v1
    if (!editSessionId && onlyVersionDirty) {
      handleReset(createNewVaultDescription(vaultVersion));
    }

    // Changing from v2 to v1 is not supported
    if (vaultVersion === "v1") return;

    // If it's not a clean form description
    if (editSessionId || (!editSessionId && !onlyVersionDirty)) {
      const indexArray = getValues("vulnerability-severities-spec.indexArray");
      const currentSeverities = getValues("vulnerability-severities-spec.severities") as IEditedVulnerabilitySeverityV1[];

      const newSeverities = currentSeverities.map((s) => convertVulnerabilitySeverityV1ToV2(s, indexArray));
      setValue("vulnerability-severities-spec.severities", newSeverities, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultVersion]);

  const recalculateCommitteeMembers = async (sectionId: string, stepNumber: number) => {
    const committeeSafeAddress = getValues("committee.multisig-address");
    const committeeSafeAddressChainId = getValues("committee.chainId");
    if (!committeeSafeAddress) return;

    const multisigInfo = await getGnosisSafeInfo(
      committeeSafeAddress,
      committeeSafeAddressChainId ? +committeeSafeAddressChainId : undefined
    );

    const committeeMembers = [...getValues("committee.members")];
    const haveToChangeMembers = !committeeMembers.some((member) => member.linkedMultisigAddress === committeeSafeAddress);

    if (haveToChangeMembers) {
      const membersToAdd = multisigInfo.owners.map((owner) => createNewCommitteeMember(owner, committeeSafeAddress));
      // Remove members linked to the previous multisig
      const membersOutsideMultisig = committeeMembers.filter((member) => !member.linkedMultisigAddress);

      committeeMembersFieldArray.remove();
      committeeMembersFieldArray.append([...membersToAdd, ...membersOutsideMultisig]);
    }
  };

  // async function saveToIpfs(vaultDescription: IVaultDescription) {
  //   try {
  //     setSavingToIpfs(true);
  //     const ipfsHash = await VaultService.uploadVaultDescriptionToIpfs(vaultDescription);
  //     navigate(`${RoutePaths.vault_editor}/${ipfsHash}`);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setSavingToIpfs(false);
  //   }
  // }

  if (loadingEditSession || loadingSteps) return <Loading fixed extraText={t("loadingVaultEditor")} />;

  const vaultEditorFormContext = { committeeMembersFieldArray };

  return (
    <VaultEditorFormContext.Provider value={vaultEditorFormContext}>
      <StyledVaultEditorContainer>
        <FormProvider {...methods}>
          <button className="mb-5" onClick={test}>
            Show form
          </button>

          <div className="sections-controller">
            {sections.map((section, idx) => (
              <VaultEditorSectionController
                key={section.id}
                onClick={() => onGoToSection(section.id)}
                active={idx === sections.findIndex((sec) => sec.id === currentSectionInfo.id)}>
                <p>{t(section.name)}</p>
                {idx < sections.length - 1 && <span>&gt;</span>}
              </VaultEditorSectionController>
            ))}
          </div>

          <VaultEditorForm className="content-wrapper">
            {/* Title */}
            <div className="editor-title">
              <div className="title">
                {/* <ArrowBackIcon /> */}
                <p>
                  {t(currentSectionInfo.title)}
                  <span>/{t(currentStepInfo.name)}</span>
                </p>
              </div>
            </div>

            {/* Steps control */}
            <VaultEditorStepper>
              {steps
                .filter((step) => !step.isInvisible)
                .map((step, index) => (
                  <VaultEditorStepController
                    key={step.id}
                    active={step.id === currentStepInfo.id}
                    passed={!!step.isValid}
                    onClick={() => onGoToStep(index)}>
                    {step.isValid && <CheckIcon className="ml-2" />}
                    {step.isValid ? "" : `${index + 1}.`}
                    {t(step.name)}
                  </VaultEditorStepController>
                ))}
            </VaultEditorStepper>

            {/* Section */}
            {steps.map((step) => (
              <Section key={step.id} visible={step.id === currentStepInfo.id}>
                <p className="section-title">{t(step.title)}</p>
                <div className="section-content">
                  <step.component />
                </div>
              </Section>
            ))}

            {/* Action buttons */}
            <div className="buttons-container">
              <Button onClick={() => onGoNext.go()}>
                {onGoNext.text} <NextIcon className="ml-2" />
              </Button>
              {onGoBack && (
                <Button styleType="invisible" onClick={() => onGoBack.go()}>
                  <BackIcon className="mr-2" /> {onGoBack.text}
                </Button>
              )}
            </div>
            {/* <div className="buttons-container">
          {formState.isDirty && ipfsHash && (
            <button type="button" onClick={() => handleReset()} className="fill">
            {t("VaultEditor.reset-button")}
            </button>
          )}
          <button type="button" onClick={handleSubmit(onSubmit)} className="fill" disabled={!formState.isDirty}>
          {t("VaultEditor.save-button")}
          </button>
        </div> */}
          </VaultEditorForm>
        </FormProvider>
      </StyledVaultEditorContainer>
    </VaultEditorFormContext.Provider>
  );
};

export { VaultEditorFormPage };
