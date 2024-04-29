import {
  IEditedSessionResponse,
  IEditedVaultDescription,
  IEditedVulnerabilitySeverityV1,
  IVaultEditionStatus,
  convertVulnerabilitySeverityV1ToV2V3,
  createNewCommitteeMember,
  createNewVaultDescription,
  editedFormToCreateVaultOnChainCall,
  getGnosisSafeInfo,
  getVaultDescriptionHash,
  isAGnosisSafeTx,
  nonEditableEditionStatus,
} from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import BackIcon from "@mui/icons-material/ArrowBack";
import NextIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import RocketIcon from "@mui/icons-material/RocketLaunchOutlined";
import { Alert, Button, CopyToClipboard, Loading, Modal, Seo } from "components";
import { CreateVaultContract } from "contracts";
import DOMPurify from "dompurify";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import { useIsGovMember } from "hooks/useIsGovMember";
import { useIsReviewer } from "hooks/useIsReviewer";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_SERVICE_URL } from "settings";
import { isValidIpfsHash } from "utils/ipfs.utils";
import { useAccount } from "wagmi";
import { checkIfAddressCanEditTheVault } from "../utils";
import * as VaultEditorService from "../vaultEditorService";
import { VerifiedEmailModal } from "./VerifiedEmailModal";
import { getEditedDescriptionYupSchema } from "./formSchema";
import { AllEditorSections, IEditorSectionsStep } from "./steps";
import { IVaultEditorFormContext, VaultEditorFormContext } from "./store";
import {
  Section,
  StyledVaultEditorContainer,
  StyledVaultEditorForm,
  VaultEditorSectionController,
  VaultEditorStepController,
  VaultEditorStepper,
} from "./styles";
import { useVaultEditorSteps } from "./useVaultEditorSteps";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { allVaults } = useVaults();

  const { editSessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { tryAuthentication } = useSiweAuth();

  const isAdvancedMode = searchParams.get("mode")?.includes("advanced") ?? false;
  const showVerifiedEmailModal = !!searchParams.get("verifiedEmail") || !!searchParams.get("unverifiedEmail");

  // Current edition description hash
  const [descriptionHash, setDescriptionHash] = useState<string | undefined>(undefined);
  // Vault description hash deployed onChain (only for existing vaults edition)
  const [onChainDescriptionHash, setOnChainDescriptionHash] = useState<string | undefined>(undefined);
  const wasEditedSinceCreated = descriptionHash !== onChainDescriptionHash;

  const isGovMember = useIsGovMember();
  const isReviewer = useIsReviewer();
  const [userHasPermissions, setUserHasPermissions] = useState(true); // Is user part of the committee?
  const [loadingEditSession, setLoadingEditSession] = useState(false); // Is the edit session loading?
  const [savingEditSession, setSavingEditSession] = useState(false); // Is the edit session being saved?
  const [creatingVault, setCreatingVault] = useState(false); // Is the vault being created on-chain?
  const [loading, setLoading] = useState(false); // Is any action loading?
  const [lastModifedOn, setLastModifedOn] = useState<Date | undefined>();
  const [allFormDisabled, setAllFormDisabled] = useState<boolean>(false);
  const [isSomeoneCreatingTheVault, setIsSomeoneCreatingTheVault] = useState<boolean>(false);

  const methods = useForm<IEditedVaultDescription>({
    resolver: yupResolver(getEditedDescriptionYupSchema(t)),
    mode: "onChange",
  });

  const { formState, reset: handleReset, control, setValue, getValues, trigger } = methods;
  const committeeMembersFieldArray = useFieldArray({ control: control, name: "committee.members" });
  const vaultVersion = useWatch({ control, name: "version" });

  const [isVaultCreated, setIsVaultCreated] = useState(false); // Is this edit session for a vault that is already created?
  const [editSessionSubmittedCreation, setEditSessionSubmittedCreation] = useState(false); // Has the edit session been submitted for creation on-chain?
  const [isEditingExistingVault, setIsEditingExistingVault] = useState(false); // Is this edit session for editing an existing vault?
  const [hasAuditDraftPublished, setHasAuditDraftPublished] = useState(false); // Does the edit session has an audit draft published?
  const [editingExistingVaultStatus, setEditingExistingVaultStatus] = useState<IVaultEditionStatus | undefined>(); // Status of the edition of an existing vault
  const isNonEditableStatus = editingExistingVaultStatus ? nonEditableEditionStatus.includes(editingExistingVaultStatus) : false;

  const vaultCreatedInfo = useWatch({ control, name: "vaultCreatedInfo" });
  const vaultType = useWatch({ control, name: "project-metadata.type" });
  const existingVault = allVaults?.find((vault) => vault.id === vaultCreatedInfo?.vaultAddress);

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
    allFormDisabled,
    saveData: () => createOrSaveEditSession(),
    onFinalSubmit: () => createVaultOnChain(),
    onFinalEditSubmit: () => sendEditionToGovApproval(),
    executeOnSaved: (sectionId, stepNumber) => {
      const committeeSectionId = "setup";
      const committeeStepId = "committee";
      const committeeStepNumber = AllEditorSections[committeeSectionId].steps.findIndex((step) => step.id === committeeStepId);

      if (sectionId === "setup" && stepNumber === committeeStepNumber) recalculateCommitteeMembers(sectionId, stepNumber);
    },
  });

  const showPublishDraftOption =
    vaultType === "audit" &&
    currentStepInfo?.id === "details" &&
    (isGovMember || isReviewer) &&
    !isVaultCreated &&
    !isEditingExistingVault;

  async function loadEditSessionData(editSessionId: string) {
    if (isVaultCreated) return; // If vault is already created, creation is blocked

    try {
      setLoadingEditSession(true);

      const editSessionResponse = await VaultEditorService.getEditSessionData(editSessionId);
      const auditDraftResponse = await VaultEditorService.hasEditSessionAuditDraftPublished(editSessionId);
      setHasAuditDraftPublished(auditDraftResponse);

      if (editSessionResponse.vaultAddress) {
        if (editSessionResponse.editingExistingVault) {
          setIsEditingExistingVault(true);
        } else {
          setIsVaultCreated(true);
        }
      }

      refreshEditSessionData(editSessionResponse, false);
      handleReset({
        ...editSessionResponse.editedDescription,
        vaultCreatedInfo: {
          vaultAddress: editSessionResponse.vaultAddress,
          claimsManager: editSessionResponse.claimsManager,
          chainId: editSessionResponse.chainId,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEditSession(false);
    }
  }

  const refreshEditSessionData = useCallback(
    async (newEditSession: IEditedSessionResponse, withReset = true) => {
      const wasSubmittedToCreation = (newEditSession.submittedToCreation ?? false) && !newEditSession.vaultAddress;

      setEditSessionSubmittedCreation(wasSubmittedToCreation);
      setDescriptionHash(newEditSession.descriptionHash);
      setLastModifedOn(newEditSession.updatedAt);
      setEditingExistingVaultStatus(newEditSession.vaultEditionStatus);
      setIsSomeoneCreatingTheVault(
        (!wasSubmittedToCreation &&
          newEditSession.lastCreationOnChainRequest &&
          moment().diff(moment(newEditSession.lastCreationOnChainRequest), "minute") < 5) ??
          false
      );

      if (withReset) handleReset(newEditSession.editedDescription, { keepErrors: true });
    },
    [handleReset]
  );

  const createOrSaveEditSession = useCallback(
    async (isCreation = false, withIpfsHash = false) => {
      try {
        // If vault is already created or is isNonEditableStatus, edition is blocked
        if (isNonEditableStatus) return;
        if (allFormDisabled) return;
        if (isSomeoneCreatingTheVault) return;
        if (!isCreation && !formState.isDirty) return;
        if (isCreation) setLoadingEditSession(true);
        if (!isCreation) setSavingEditSession(true);

        let sessionIdOrSessionResponse: string | IEditedSessionResponse;

        if (isCreation) {
          sessionIdOrSessionResponse = await VaultEditorService.upsertEditSession(
            undefined,
            undefined,
            withIpfsHash ? editSessionId : undefined
          );
        } else {
          const data: IEditedVaultDescription = getValues();
          sessionIdOrSessionResponse = await VaultEditorService.upsertEditSession(data, editSessionId, undefined);
        }

        if (typeof sessionIdOrSessionResponse === "string") {
          navigate(`${RoutePaths.vault_editor}/${sessionIdOrSessionResponse}`, { replace: true });
        } else {
          refreshEditSessionData(sessionIdOrSessionResponse);
        }

        setSavingEditSession(false);
        setLoadingEditSession(false);
      } catch (error) {
        setSavingEditSession(false);
        setLoadingEditSession(false);

        if (!editSessionId) return;
        const editSessionResponse = await VaultEditorService.getEditSessionData(editSessionId);
        refreshEditSessionData(editSessionResponse);
      }
    },
    [
      allFormDisabled,
      editSessionId,
      formState.isDirty,
      getValues,
      isNonEditableStatus,
      isSomeoneCreatingTheVault,
      navigate,
      refreshEditSessionData,
    ]
  );

  const createVaultOnChain = useCallback(async () => {
    if (allFormDisabled) return;

    try {
      const data: IEditedVaultDescription = getValues();
      if (!editSessionId) return;
      if (!descriptionHash) return;
      if (!data.committee.chainId) return;
      if (!address) return;
      setCreatingVault(true);

      const vaultOnChainCall = editedFormToCreateVaultOnChainCall(data, descriptionHash);

      const gnosisInfo = await getGnosisSafeInfo(address, +data.committee.chainId);
      if (gnosisInfo.isSafeAddress) {
        setCreatingVault(false);
        return alert(t("youCantExecuteThisTxWithMultisig"));
      }

      let editSessionResponse = await VaultEditorService.getEditSessionData(editSessionId);
      if (editSessionResponse.descriptionHash !== descriptionHash) {
        setCreatingVault(false);
        refreshEditSessionData(editSessionResponse);

        confirm({
          title: t("yourVaultChanged"),
          description: t("yourVaultChangedExplanation"),
          confirmText: t("gotIt"),
        });
        return;
      }

      await VaultEditorService.setLastCreationOnChainRequest(editSessionId);
      // Refresh data
      editSessionResponse = await VaultEditorService.getEditSessionData(editSessionId);
      refreshEditSessionData(editSessionResponse);

      const createdVaultData = await CreateVaultContract.send(vaultOnChainCall);

      if (createdVaultData) {
        const txReceipt = await createdVaultData.wait();
        const isGnosisTx = await isAGnosisSafeTx(txReceipt.transactionHash, +data.committee.chainId);
        // const vaultAddress = txReceipt.logs[0].address;

        if (txReceipt.status === 1) {
          await VaultEditorService.setEditSessionSubmittedToCreation(editSessionId);
          setCreatingVault(false);
          navigate(
            `${RoutePaths.vault_editor}?vaultReady=true${
              isGnosisTx ? `&gnosisMultisig=${data.committee.chainId}:${data.committee["multisig-address"]}` : ""
            }`,
            { replace: true }
          );
        }
      }
    } catch (error) {
      console.error(error);
      setCreatingVault(false);
    }
  }, [address, allFormDisabled, confirm, descriptionHash, editSessionId, getValues, navigate, refreshEditSessionData, t]);

  const sendEditionToGovApproval = async () => {
    if (allFormDisabled) return;
    if (!wasEditedSinceCreated) return;
    if (!editSessionId) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    const wantsToEdit = await confirm({
      confirmText: t("requestApproval"),
      description: t("areYouSureYouWantToEditThisVault"),
    });

    if (wantsToEdit) {
      setLoading(true);
      await createOrSaveEditSession(false, false);
      await VaultEditorService.sendEditionToGovApproval(editSessionId);
      setLoading(false);

      goToStatusPage();
    }
  };

  const cancelApprovalRequest = async () => {
    if (!userHasPermissions) return;
    if (!editSessionId) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    const wantsToCancel = await confirm({
      confirmText: t("cancelApprovalRequest"),
      description: t("areYouSureYouWantToCancelApprovalRequest"),
    });

    if (wantsToCancel) {
      setLoading(true);
      const sessionResponse = await VaultEditorService.cancelEditionApprovalRequest(editSessionId);
      setLoading(false);
      if (sessionResponse) {
        setDescriptionHash(sessionResponse.descriptionHash);
        setLastModifedOn(sessionResponse.updatedAt);
        setEditingExistingVaultStatus(sessionResponse.vaultEditionStatus);
        handleReset(sessionResponse.editedDescription, { keepDefaultValues: true, keepErrors: true, keepDirty: true });
      }
    }
  };

  const publishAuditDraft = async () => {
    if (!isGovMember && !isReviewer) return;
    if (!editSessionId) return;

    const isFormValid = await trigger((currentStepInfo?.formFields ?? []) as any);
    if (!isFormValid) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    const wantsToPublish = await confirm({
      title: t("publishDraft"),
      confirmText: t("publishDraft"),
      description: t("areYouSureYouWantToPublishAuditDraft"),
    });

    if (wantsToPublish) {
      try {
        setLoading(true);
        await createOrSaveEditSession(false, false);
        await VaultEditorService.publishAuditDraft(editSessionId);
        setLoading(false);
        setHasAuditDraftPublished(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
        alert("Error publishing draft");
      }
    }
  };

  const deleteAuditDraft = async () => {
    if (!isGovMember && !isReviewer) return;
    if (!editSessionId) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    const wantsToDelete = await confirm({
      title: t("deleteDraft"),
      confirmText: t("deleteDraft"),
      description: t("areYouSureYouWantToDeleteAuditDraft"),
    });

    if (wantsToDelete) {
      try {
        setLoading(true);
        await VaultEditorService.deleteAuditDraft(editSessionId);
        setLoading(false);
        setHasAuditDraftPublished(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        alert("Error deleting draft");
      }
    }
  };

  // Getting descriptionHash that is deployed onChain
  const getOriginalVaultDescriptionHash = useCallback(async () => {
    const createdVaultInfo = getValues("vaultCreatedInfo");

    if (createdVaultInfo) {
      const descriptionHash = await getVaultDescriptionHash(createdVaultInfo.vaultAddress, createdVaultInfo.chainId);
      setOnChainDescriptionHash(descriptionHash);
    }
  }, [getValues]);

  // Handler for redirecting from the first page. If route is 'new-vault' the user is redirected to a new editSession
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

  // Handler for initializing the form steps
  useEffect(() => {
    presetIsEditingExistingVault(isEditingExistingVault);
    initFormSteps(isEditingExistingVault);
    if (isEditingExistingVault) getOriginalVaultDescriptionHash();
  }, [loadingEditSession, initFormSteps, presetIsEditingExistingVault, isEditingExistingVault, getOriginalVaultDescriptionHash]);

  // Check if user has permissions to edit the vault depending on the status (Vault creation or vault edition)
  useEffect(() => {
    const checkPermissions = async () => {
      if (isEditingExistingVault && existingVault) {
        const { canEditVault } = await checkIfAddressCanEditTheVault(address, existingVault.chainId, existingVault.committee);

        if (isNonEditableStatus) {
          setUserHasPermissions(canEditVault);
          setAllFormDisabled(true);
          return;
        }

        if (!canEditVault) {
          setUserHasPermissions(false);
          setAllFormDisabled(true);
        } else {
          setUserHasPermissions(false);
          setAllFormDisabled(true);

          // Siwe: Only signed in users can edit the vault
          tryAuthentication().then((isAuthenticated) => {
            setUserHasPermissions(isAuthenticated);
            setAllFormDisabled(!isAuthenticated);
          });
        }
      } else {
        setUserHasPermissions(true);
        setAllFormDisabled(isVaultCreated || editSessionSubmittedCreation);
      }
    };
    checkPermissions();
  }, [
    isVaultCreated,
    isNonEditableStatus,
    isEditingExistingVault,
    editSessionSubmittedCreation,
    address,
    getValues,
    existingVault,
    tryAuthentication,
  ]);

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

      const newSeverities = currentSeverities.map((s) => convertVulnerabilitySeverityV1ToV2V3(s, indexArray));
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
    window.open(`${BASE_SERVICE_URL}/files/${descriptionHash}`, "_blank");
  };

  const goToStatusPage = () => {
    if (!vaultCreatedInfo) return;

    navigate(`${RoutePaths.vault_editor}/status/${vaultCreatedInfo.chainId}/${vaultCreatedInfo.vaultAddress}`);
  };

  const goBackToVaultEditor = () => {
    navigate(`${RoutePaths.vault_editor}/${editSessionId}${isAdvancedMode ? "?mode=advanced" : ""}`);
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

    if (currentStep?.disabledOptions?.includes("allEmailsVerified")) {
      const emails = getValues("project-metadata.emails");
      if (!emails || emails.length === 0) return t("at-least-one-email");
      if (emails.some((email) => email.status !== "verified")) return t("pleaseVerifyAllEmails");
    }

    const isLastStep = currentStep?.id === steps[steps.length - 1].id;
    if (isEditingExistingVault && isLastStep && !userHasPermissions) return true;
    if (isNonEditableStatus && isEditingExistingVault && isLastStep) return true;

    return false;
  };

  const getNextButtonAction = (currentStep: IEditorSectionsStep) => {
    const isDisabled = getNextButtonDisabled(currentStep);

    if (isDisabled) return () => {};
    return () => onGoNext.go();
  };

  const getEditingExistingVaultAlert = () => {
    if (!isEditingExistingVault) return null;

    if (!userHasPermissions) {
      return <Alert content={t("connectWithCommitteeMultisigOrBeAMemberForEditing")} type="error" />;
    }

    if (isNonEditableStatus && editingExistingVaultStatus) {
      if (editingExistingVaultStatus === "pendingApproval") {
        return <Alert content={t("youCantEditBecauseIsPendingApproval")} type="warning" />;
      } else {
        return (
          <Alert
            content={t("youCantEditBecauseIsStatus", { status: t(`${editingExistingVaultStatus}_status`) })}
            type="warning"
          />
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
    if (!isEditingExistingVault) return null;

    if (!userHasPermissions) {
      return (
        <div className="buttons">
          <Button onClick={goToStatusPage} styleType="outlined">
            <BackIcon className="mr-2" /> {t("goToStatusPage")}
          </Button>
        </div>
      );
    }

    if (isNonEditableStatus && editingExistingVaultStatus) {
      if (editingExistingVaultStatus === "pendingApproval") {
        return (
          <div className="buttons">
            <Button onClick={goToStatusPage} styleType="outlined">
              <BackIcon className="mr-2" /> {t("goToStatusPage")}
            </Button>
            <Button disabled={!userHasPermissions} onClick={() => cancelApprovalRequest()} filledColor="error">
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
          <Button onClick={() => sendEditionToGovApproval()}>
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

  const vaultEditorFormContext: IVaultEditorFormContext = {
    editSessionId,
    committeeMembersFieldArray,
    saveEditSessionData: createOrSaveEditSession,
    isVaultCreated,
    isEditingExistingVault,
    existingVault,
    allFormDisabled: allFormDisabled || isSomeoneCreatingTheVault,
    isAdvancedMode,
  };

  return (
    <>
      <Seo title={t("seo.createNewVaultTitle")} />
      <VaultEditorFormContext.Provider value={vaultEditorFormContext}>
        <StyledVaultEditorContainer>
          <FormProvider {...methods}>
            <div className="sections-controller content-wrapper-md">
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

            <StyledVaultEditorForm className="content-wrapper-md">
              {/* Title */}
              {descriptionHash && (isAdvancedMode || isEditingExistingVault) && (
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

                <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("copyEditorLink")} />
              </div>

              {/* Alert (isSomeoneCreatingTheVault) */}
              {isSomeoneCreatingTheVault && <Alert content={t("someoneIsCreatingTheVault")} type="warning" className="mb-5" />}

              {/* Steps control */}
              <VaultEditorStepper>
                {steps
                  .filter((step) => {
                    if (step.isInvisible === "all") return false;
                    if (step.isInvisible === "editing") return !isEditingExistingVault;
                    if (step.isInvisible === "creation") return isEditingExistingVault;
                    return true;
                  })
                  .map((step, index) => (
                    <VaultEditorStepController
                      key={step.id}
                      active={step.id === currentStepInfo.id}
                      passed={!!step.isValid}
                      onClick={() => onGoToStep(index)}
                    >
                      {step.isValid && <CheckIcon />}
                      {/* {step.isValid ? "" : `${index + 1}.`} */}
                      {t(step.name)}
                    </VaultEditorStepController>
                  ))}
              </VaultEditorStepper>

              {/* Section */}
              {steps.map((step) => (
                <Section key={step.id} visible={step.id === currentStepInfo.id}>
                  {step.title && (
                    <p className="section-title">{t(isEditingExistingVault ? step.title.editing : step.title.creation)}</p>
                  )}
                  <div className="section-content">
                    <step.component />
                  </div>
                </Section>
              ))}

              {/* Alert section */}
              {isVaultCreated && <Alert content={t("vaultBlockedBecauseIsCreated")} type="warning" />}
              {editSessionSubmittedCreation && <Alert content={t("vaultBlockedBecauseIsPendingCreation")} type="warning" />}

              {/* Action buttons */}
              <div className="buttons-container">
                <div>
                  <Button disabled={!!getNextButtonDisabled(currentStepInfo)} onClick={getNextButtonAction(currentStepInfo)}>
                    {onGoNext.text} <NextIcon className="ml-2" />
                  </Button>
                  <span>{getNextButtonDisabled(currentStepInfo)}</span>
                </div>
                <div className="backButton">
                  {showPublishDraftOption && (
                    <Button
                      styleType={hasAuditDraftPublished ? "filled" : "outlined"}
                      filledColor={hasAuditDraftPublished ? "error" : "secondary"}
                      onClick={hasAuditDraftPublished ? deleteAuditDraft : publishAuditDraft}
                    >
                      {hasAuditDraftPublished ? <DeleteIcon className="mr-2" /> : <RocketIcon className="mr-2" />}
                      {hasAuditDraftPublished ? t("deleteDraft") : t("publishDraft")}
                    </Button>
                  )}
                  {onGoBack && (
                    <Button styleType="invisible" onClick={() => onGoBack.go()}>
                      <BackIcon className="mr-2" /> {onGoBack.text}
                    </Button>
                  )}
                  {isVaultCreated && (
                    <Button onClick={goToStatusPage} styleType="outlined">
                      {t("goToStatusPage")}
                    </Button>
                  )}
                </div>
              </div>

              {/* Editing existing vault action button */}
              {isEditingExistingVault && (
                <div className="editing-existing-buttons">
                  {getEditingExistingVaultAlert()}
                  {getEditingExistingVaultButtons()}
                </div>
              )}
            </StyledVaultEditorForm>
          </FormProvider>
        </StyledVaultEditorContainer>

        {creatingVault && <Loading fixed extraText={`${t("cretingVaultOnChain")}...`} />}
        {loading && <Loading fixed extraText={`${t("loading")}...`} />}
        {savingEditSession && <Loading fixed extraText={`${t("savingEditSession")}...`} />}

        <Modal isShowing={showVerifiedEmailModal} onHide={goBackToVaultEditor} disableOnOverlayClose>
          <VerifiedEmailModal closeModal={goBackToVaultEditor} />
        </Modal>
      </VaultEditorFormContext.Provider>
    </>
  );
};

export { VaultEditorFormPage };
