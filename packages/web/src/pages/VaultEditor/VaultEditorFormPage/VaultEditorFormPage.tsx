import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import moment from "moment";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createNewCommitteeMember,
  createNewVaultDescription,
  convertVulnerabilitySeverityV1ToV2,
  editedFormToCreateVaultOnChainCall,
  nonEditableEditionStatus,
} from "@hats-finance/shared";
import { CreateVaultContract } from "contracts";
import { getGnosisSafeInfo } from "utils/gnosis.utils";
import { isValidIpfsHash } from "utils/ipfs.utils";
import { BASE_SERVICE_URL } from "settings";
import { RoutePaths } from "navigation";
import { Alert, Button, CopyToClipboard, Loading } from "components";
import { ChainsConfig } from "config/chains";
import useConfirm from "hooks/useConfirm";
import * as VaultService from "./vaultService";
import * as VaultStatusService from "../VaultStatusPage/vaultStatusService";
import { IEditedVaultDescription, IEditedVulnerabilitySeverityV1, IVaultEditionStatus, IEditedSessionResponse } from "types";
import { getEditedDescriptionYupSchema } from "./formSchema";
import { useVaultEditorSteps } from "./useVaultEditorSteps";
import { AllEditorSections, IEditorSectionsStep } from "./steps";
import { checkIfAddressIsPartOfComitteOnForm } from "./utils";
import { VaultEditorFormContext } from "./store";
import {
  Section,
  StyledVaultEditorForm,
  VaultEditorStepController,
  VaultEditorSectionController,
  VaultEditorStepper,
  StyledVaultEditorContainer,
} from "./styles";
import BackIcon from "@mui/icons-material/ArrowBack";
import NextIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import CopyIcon from "@mui/icons-material/ContentCopyOutlined";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { editSessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const isAdvancedMode = searchParams.get("mode")?.includes("advanced") ?? false;

  // Current edition description hash
  const [descriptionHash, setDescriptionHash] = useState<string | undefined>(undefined);
  // Vault description hash deployed onChain (only for existing vaults edition)
  const [originalDescriptionHash, setOriginalDescriptionHash] = useState<string | undefined>(undefined);
  const wasEditedSinceCreated = descriptionHash !== originalDescriptionHash;

  const [userHasNoPermissions, setUserHasNoPermissions] = useState(false);
  const [loadingEditSession, setLoadingEditSession] = useState(false);
  const [creatingVault, setCreatingVault] = useState(false);
  const [lastModifedOn, setLastModifedOn] = useState<Date | undefined>();
  const [allFormDisabled, setAllFormDisabled] = useState<boolean>(false);

  const methods = useForm<IEditedVaultDescription>({
    resolver: yupResolver(getEditedDescriptionYupSchema(t)),
    mode: "onChange",
  });

  const { formState, reset: handleReset, control, setValue, getValues } = methods;
  const committeeMembersFieldArray = useFieldArray({ control: control, name: "committee.members" });
  const vaultVersion = useWatch({ control, name: "version" });

  const [isVaultCreated, setIsVaultCreated] = useState(false);
  const [isEditingExitingVault, setIsEditingExitingVault] = useState(false);
  const [editingExitingVaultStatus, setEditingExitingVaultStatus] = useState<IVaultEditionStatus | undefined>();
  const isNonEditableStatus = editingExitingVaultStatus ? nonEditableEditionStatus.includes(editingExitingVaultStatus) : false;
  const vaultCreatedInfo = useWatch({ control, name: "vaultCreatedInfo" });

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
    presetIsEditingExistingVault,
  } = useVaultEditorSteps(methods, {
    saveData: () => createOrSaveEditSession(),
    onFinalSubmit: () => createVaultOnChain(),
    onFinalEditSubmit: () => finishVaultEdition(),
    executeOnSaved: (sectionId, stepNumber) => {
      const committeeSectionId = "setup";
      const committeeStepId = "committee";
      const committeeStepNumber = AllEditorSections[committeeSectionId].steps.findIndex((step) => step.id === committeeStepId);

      if (sectionId === "setup" && stepNumber === committeeStepNumber) recalculateCommitteeMembers(sectionId, stepNumber);
    },
  });

  const createOrSaveEditSession = async (isCreation = false, withIpfsHash = false, vaultEditionStatus?: IVaultEditionStatus) => {
    // If vault is already created or is isNonEditableStatus, edition is blocked
    if (allFormDisabled) return;
    if (isCreation) setLoadingEditSession(true);

    let sessionIdOrSessionResponse: string | IEditedSessionResponse;

    if (isCreation) {
      sessionIdOrSessionResponse = await VaultService.upsertEditSession(
        undefined,
        undefined,
        withIpfsHash ? editSessionId : undefined
      );
    } else {
      const data: IEditedVaultDescription = getValues();
      sessionIdOrSessionResponse = await VaultService.upsertEditSession(data, editSessionId, undefined, vaultEditionStatus);
    }

    if (typeof sessionIdOrSessionResponse === "string") {
      navigate(`${RoutePaths.vault_editor}/${sessionIdOrSessionResponse}`, { replace: true });
    } else if (vaultEditionStatus !== undefined) {
      goToStatusPage();
    } else {
      setDescriptionHash(sessionIdOrSessionResponse.descriptionHash);
      setLastModifedOn(sessionIdOrSessionResponse.updatedAt);
      setEditingExitingVaultStatus(sessionIdOrSessionResponse.vaultEditionStatus);
      handleReset(sessionIdOrSessionResponse.editedDescription, { keepDefaultValues: true, keepErrors: true, keepDirty: true });
    }

    setLoadingEditSession(false);
  };

  async function loadEditSessionData(editSessionId: string) {
    if (isVaultCreated) return; // If vault is already created, creation is blocked

    try {
      setLoadingEditSession(true);

      const editSessionResponse = await VaultService.getEditSessionData(editSessionId);
      console.log(`EditSession: `, editSessionResponse);

      if (editSessionResponse.vaultAddress) {
        if (editSessionResponse.editingExistingVault) {
          setIsEditingExitingVault(true);
        } else {
          setIsVaultCreated(true);
        }
      }

      setDescriptionHash(editSessionResponse.descriptionHash);
      setLastModifedOn(editSessionResponse.updatedAt);
      setEditingExitingVaultStatus(editSessionResponse.vaultEditionStatus);
      handleReset({
        ...editSessionResponse.editedDescription,
        vaultCreatedInfo: {
          vaultAddress: editSessionResponse.vaultAddress,
          chainId: editSessionResponse.chainId,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEditSession(false);
    }
  }

  const createVaultOnChain = async () => {
    if (allFormDisabled) return;

    try {
      const data: IEditedVaultDescription = getValues();
      if (!descriptionHash) return;
      if (!data.committee.chainId) return;
      if (!address) return;

      const rewardController = ChainsConfig[+data.committee.chainId].rewardController;
      const vaultOnChainCall = editedFormToCreateVaultOnChainCall(data, descriptionHash, rewardController);

      const gnosisInfo = await getGnosisSafeInfo(address, +data.committee.chainId);
      if (gnosisInfo.isSafeAddress) return alert(t("youCantExecuteThisTxWithMultisig"));

      setCreatingVault(true);
      const createdVaultData = await CreateVaultContract.send(vaultOnChainCall);

      if (createdVaultData) {
        const vaultInfo = await VaultService.onVaultCreated(createdVaultData.hash, +data.committee.chainId);
        setCreatingVault(false);
        navigate(`${RoutePaths.vault_editor}/status/${data.committee.chainId}/${vaultInfo?.vaultAddress}`);
      }
    } catch (error) {
      console.error(error);
      setCreatingVault(false);
    }
  };

  const finishVaultEdition = async (desiredStatus: IVaultEditionStatus = "pendingApproval") => {
    if (allFormDisabled) return;
    if (!wasEditedSinceCreated) return;

    const wantsToEdit = await confirm({
      confirmText: t("requestApproval"),
      description: t("areYouSureYouWantToEditThisVault"),
    });

    if (wantsToEdit) createOrSaveEditSession(false, false, desiredStatus);
  };

  const cancelApprovalRequest = async () => {
    if (userHasNoPermissions) return;
    if (!editSessionId) return;

    const wantsToCancel = await confirm({
      confirmText: t("cancelApprovalRequest"),
      description: t("areYouSureYouWantToCancelApprovalRequest"),
    });

    if (wantsToCancel) {
      const sessionResponse = await VaultService.cancelEditionApprovalRequest(editSessionId);
      if (sessionResponse) {
        setDescriptionHash(sessionResponse.descriptionHash);
        setLastModifedOn(sessionResponse.updatedAt);
        setEditingExitingVaultStatus(sessionResponse.vaultEditionStatus);
        handleReset(sessionResponse.editedDescription, { keepDefaultValues: true, keepErrors: true, keepDirty: true });
      }
    }
  };

  // Getting descriptionHash that is deployed onChain
  const getOriginalVaultDescriptionHash = useCallback(async () => {
    const createdVaultInfo = getValues("vaultCreatedInfo");

    if (createdVaultInfo) {
      const vaultInfo = await VaultStatusService.getVaultInformation(createdVaultInfo.vaultAddress, createdVaultInfo.chainId);
      setOriginalDescriptionHash(vaultInfo.descriptionHash);
    }
  }, [getValues]);

  useEffect(() => {
    presetIsEditingExistingVault(isEditingExitingVault);
    initFormSteps();
    if (isEditingExitingVault) getOriginalVaultDescriptionHash();
  }, [loadingEditSession, initFormSteps, presetIsEditingExistingVault, isEditingExitingVault, getOriginalVaultDescriptionHash]);

  useEffect(() => {
    if (editSessionId) {
      if (editSessionId === "new-vault") {
        createOrSaveEditSession(true);
      } else {
        const isIpfsHash = isValidIpfsHash(editSessionId);
        if (isIpfsHash) {
          createOrSaveEditSession(true, isIpfsHash);
        } else {
          loadEditSessionData(editSessionId);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSessionId]);

  useEffect(() => {
    const editData = getValues();
    const isMemberOrMultisig = checkIfAddressIsPartOfComitteOnForm(address, editData);

    if (isEditingExitingVault && !isMemberOrMultisig) {
      setUserHasNoPermissions(true);
      setAllFormDisabled(true);
    } else {
      setUserHasNoPermissions(false);
      setAllFormDisabled(isVaultCreated || isNonEditableStatus);
    }
  }, [isVaultCreated, isNonEditableStatus, isEditingExitingVault, address, getValues]);

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

  const handleCopyEditorLink = () => {
    const url = document.location.href;
    navigator.clipboard.writeText(url);
  };

  const recalculateCommitteeMembers = async (sectionId: string, stepNumber: number) => {
    const committeeSafeAddress = getValues("committee.multisig-address");
    const committeeSafeAddressChainId = getValues("committee.chainId");
    if (!committeeSafeAddress) return;

    const multisigInfo = await getGnosisSafeInfo(
      committeeSafeAddress,
      committeeSafeAddressChainId ? +committeeSafeAddressChainId : undefined
    );

    let committeeMembers = [...getValues("committee.members")];
    const newAddressesToAdd = multisigInfo.owners.filter((owner) => !committeeMembers.some((member) => member.address === owner));

    const isANewMultisig = !committeeMembers.some((member) => member.linkedMultisigAddress === committeeSafeAddress);
    if (!isANewMultisig) return;

    // Update linkedMultisigAddress based on the new multisig owners. And save the members that are not part of the multisig
    // anymore to move them to the end of the list
    const indexesToMoveToTheEnd: number[] = [];
    for (const [idx, member] of committeeMembers.entries()) {
      if (multisigInfo.owners.includes(member.address)) {
        committeeMembersFieldArray.update(idx, { ...member, linkedMultisigAddress: committeeSafeAddress });
      } else {
        committeeMembersFieldArray.update(idx, { ...member, linkedMultisigAddress: "" });
        indexesToMoveToTheEnd.push(idx);
      }
    }

    // Add new members to the list
    if (newAddressesToAdd.length > 0) {
      committeeMembersFieldArray.prepend(
        [...newAddressesToAdd.map((address) => createNewCommitteeMember(address, committeeSafeAddress))],
        { shouldFocus: false }
      );
    }

    // Move members that are not part of the multisig anymore to the end of the list
    let moved = 0;
    for (const idx of indexesToMoveToTheEnd) {
      committeeMembersFieldArray.move(idx - moved, committeeMembers.length - 1);
      moved++;
    }

    createOrSaveEditSession();
  };

  const goToDescriptionHashContent = () => {
    window.open(`${BASE_SERVICE_URL}/ipfs/${descriptionHash}`, "_blank");
  };

  const goToStatusPage = () => {
    if (!vaultCreatedInfo) return;

    navigate(`${RoutePaths.vault_editor}/status/${vaultCreatedInfo.chainId}/${vaultCreatedInfo.vaultAddress}`);
  };

  const getNextButtonDisabled = (currentStep: IEditorSectionsStep) => {
    if (currentStep?.disabledOptions?.includes("onlyIfVaultNotCreated")) {
      if (isVaultCreated) return t("thisVaultIsAlredyCreated");
    }

    if (currentStep?.disabledOptions?.includes("editingFormDirty")) {
      if (!wasEditedSinceCreated) return t("editSessionIsNotDirty");
    }

    if (currentStep?.disabledOptions?.includes("needsAccount")) {
      if (!address) return t("youNeedToConnectToAWallet");
    }

    const isLastStep = currentStep?.id === steps[steps.length - 1].id;
    if (isEditingExitingVault && isLastStep && userHasNoPermissions) return true;
    if (isNonEditableStatus && isEditingExitingVault && isLastStep) return true;

    return false;
  };

  const getNextButtonAction = (currentStep: IEditorSectionsStep) => {
    const isDisabled = getNextButtonDisabled(currentStep);

    if (isDisabled) return () => {};
    return () => onGoNext.go();
  };

  const getEditingExistingVaultAlert = () => {
    if (!isEditingExitingVault) return null;

    if (userHasNoPermissions) {
      return <Alert content={t("connectWithCommitteeMultisigOrBeAMember")} type="error" />;
    }

    if (isNonEditableStatus && editingExitingVaultStatus) {
      if (editingExitingVaultStatus === "pendingApproval") {
        return <Alert content={t("youCantEditBecauseIsPendingApproval")} type="warning" />;
      } else {
        return (
          <Alert content={t("youCantEditBecauseIsStatus", { status: t(`${editingExitingVaultStatus}_status`) })} type="warning" />
        );
      }
    }

    if (wasEditedSinceCreated) {
      return <Alert content={t("doneEditingTheExistingVault")} type="warning" />;
    } else {
      return <Alert content={t("youAreEditingAnExistingVault")} type="warning" />;
    }
  };

  const getEditingExistingVaultButtons = () => {
    if (!isEditingExitingVault) return null;

    if (userHasNoPermissions) {
      return (
        <div className="buttons">
          <Button onClick={goToStatusPage} styleType="outlined">
            <BackIcon className="mr-2" /> {t("goToStatusPage")}
          </Button>
        </div>
      );
    }

    if (isNonEditableStatus && editingExitingVaultStatus) {
      if (editingExitingVaultStatus === "pendingApproval") {
        return (
          <div className="buttons">
            <Button onClick={goToStatusPage} styleType="outlined">
              <BackIcon className="mr-2" /> {t("goToStatusPage")}
            </Button>
            <Button disabled={userHasNoPermissions} onClick={cancelApprovalRequest} filledColor="error">
              {t("cancelApprovalRequest")}
            </Button>
          </div>
        );
      } else {
        return (
          <div className="buttons">
            <Button onClick={goToStatusPage} styleType="outlined">
              <BackIcon className="mr-2" /> {t("goToStatusPage")}
            </Button>
          </div>
        );
      }
    }

    if (wasEditedSinceCreated) {
      return (
        <div className="buttons">
          <Button onClick={goToStatusPage} styleType="outlined">
            <BackIcon className="mr-2" /> {t("goToStatusPage")}
          </Button>
          <Button onClick={() => finishVaultEdition()}>
            {t("sendToGovernanceApproval")} <NextIcon className="ml-2" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="buttons">
          <Button onClick={goToStatusPage} styleType="outlined">
            <BackIcon className="mr-2" /> {t("goToStatusPage")}
          </Button>
        </div>
      );
    }
  };

  if (loadingEditSession || loadingSteps || !currentStepInfo || !currentSectionInfo) {
    return <Loading fixed extraText={`${t("loadingVaultEditor")}...`} />;
  }

  const vaultEditorFormContext = {
    editSessionId,
    committeeMembersFieldArray,
    saveEditSessionData: createOrSaveEditSession,
    isVaultCreated,
    isEditingExitingVault,
    allFormDisabled,
  };

  return (
    <VaultEditorFormContext.Provider value={vaultEditorFormContext}>
      <StyledVaultEditorContainer>
        <FormProvider {...methods}>
          <div className="sections-controller">
            {sections.map((section, idx) => (
              <VaultEditorSectionController
                key={section.id}
                onClick={() => onGoToSection(section.id)}
                active={idx === sections.findIndex((sec) => sec.id === currentSectionInfo.id)}
              >
                <p>{t(section.name)}</p>
                {idx < sections.length - 1 && <span>&gt;</span>}
              </VaultEditorSectionController>
            ))}
          </div>

          <StyledVaultEditorForm className="content-wrapper">
            {/* Title */}
            {descriptionHash && (isAdvancedMode || isEditingExitingVault) && (
              <p className="descriptionHash" onClick={goToDescriptionHashContent}>
                {descriptionHash}
              </p>
            )}
            {lastModifedOn && (
              <p className="lastModifiedOn">
                <strong>{t("saved")}</strong> {moment(lastModifedOn).fromNow()}
              </p>
            )}
            <div className="editor-title">
              <div className="title">
                <p>
                  {t(currentSectionInfo.title)}
                  <span>/{t(currentStepInfo.name)}</span>
                </p>
              </div>

              <CopyToClipboard valueToCopy="asd" overlayText={t("copyEditorLink")} />
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
                    onClick={() => onGoToStep(index)}
                  >
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

            {/* Alert section */}
            {isVaultCreated && <Alert onClick={goToStatusPage} content={t("vaultBlockedBecauseIsCreated")} type="warning" />}

            {/* Action buttons */}
            <div className="buttons-container">
              <div>
                <Button disabled={!!getNextButtonDisabled(currentStepInfo)} onClick={getNextButtonAction(currentStepInfo)}>
                  {onGoNext.text} <NextIcon className="ml-2" />
                </Button>
                <span>{getNextButtonDisabled(currentStepInfo)}</span>
              </div>
              {onGoBack && (
                <Button styleType="invisible" onClick={() => onGoBack.go()}>
                  <BackIcon className="mr-2" /> {onGoBack.text}
                </Button>
              )}
            </div>

            {/* Editing existing vault action button */}
            {isEditingExitingVault && (
              <div className="editing-existing-buttons">
                {getEditingExistingVaultAlert()}
                {getEditingExistingVaultButtons()}
              </div>
            )}
          </StyledVaultEditorForm>
        </FormProvider>
      </StyledVaultEditorContainer>
      {creatingVault && <Loading fixed extraText={`${t("cretingVaultOnChain")}...`} />}
    </VaultEditorFormContext.Provider>
  );
};

export { VaultEditorFormPage };
