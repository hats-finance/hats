import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ClearIcon from "@mui/icons-material/HighlightOffOutlined";
import { Button, Loading, Seo } from "components";
import { LocalStorage } from "constants/constants";
import { LogClaimContract } from "contracts";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useUserHasCollectedSignature } from "pages/Honeypots/VaultDetailsPage/hooks";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { calcCid } from "pages/Submissions/SubmissionFormPage/encrypt";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IS_PROD } from "settings";
import { getAppVersion } from "utils";
import { slugify } from "utils/slug.utils";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import {
  SubmissionContactInfo,
  SubmissionDescriptions,
  SubmissionProject,
  SubmissionSubmit,
  SubmissionTermsAndProcess,
} from "../SubmissionFormPage/FormSteps";
import SubmissionFormCard from "../SubmissionFormPage/SubmissionFormCard/SubmissionFormCard";
import { ISubmissionFormContext, SUBMISSION_INIT_DATA, SubmissionFormContext } from "./store";
import { StyledSubmissionFormPage } from "./styles";
import { submitVulnerabilitySubmission, verifyAuditWizardSignature } from "./submissionsService.api";
import {
  IAuditWizardSubmissionData,
  ISubmissionData,
  SubmissionOpStatus,
  SubmissionStep,
  getCurrentAuditwizardSubmission,
} from "./types";

export const SubmissionFormPage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: hackerProfile } = useProfileByAddress(address);

  const [currentStep, setCurrentStep] = useState<number>();
  const [submissionData, setSubmissionData] = useState<ISubmissionData>();
  const [allFormDisabled, setAllFormDisabled] = useState(false);
  const [receivedSubmissionAuditwizard, setReceivedSubmissionAuditwizard] = useState<IAuditWizardSubmissionData | undefined>();

  const { activeVaults, vaultsReadyAllChains } = useVaults();
  const vault = (activeVaults ?? []).find((vault) => vault.id === submissionData?.project?.projectId);

  const requireMessageSignature = vault?.description?.["project-metadata"].requireMessageSignature;
  const { data: userHasCollectedSignature, isLoading: isLoadingCollectedSignature } = useUserHasCollectedSignature(vault);

  const steps = useMemo(
    () => [
      { title: t("Submissions.selectProject"), component: SubmissionProject, card: SubmissionStep.project },
      { title: t("Submissions.termsAndProcess"), component: SubmissionTermsAndProcess, card: SubmissionStep.terms },
      { title: t("Submissions.communicationChannel"), component: SubmissionContactInfo, card: SubmissionStep.contact },
      {
        title: t("Submissions.submissionDescription"),
        component: SubmissionDescriptions,
        card: SubmissionStep.submissionsDescriptions,
      },
      { title: t("submit"), component: SubmissionSubmit, card: SubmissionStep.submission },
    ],
    [t]
  );

  const {
    data: callData,
    reset: callReset,
    send: sendVulnerabilityOnChain,
    isLoading: isSigningSubmission,
  } = LogClaimContract.hook(vault);
  const { isLoading: isSubmitting } = useWaitForTransaction({
    hash: callData?.hash,
    onSettled(data, error) {
      if (error) return reset();

      if (submissionData && data?.transactionHash && chain?.id) {
        const newVulnerabilityData: ISubmissionData = {
          ...submissionData,
          submissionResult: {
            verified: true,
            txStatus: !error && data.status === 1 ? SubmissionOpStatus.Success : SubmissionOpStatus.Fail,
            botStatus: SubmissionOpStatus.Pending,
            transactionHash: data?.transactionHash,
            chainId: chain?.id,
            auditCompetitionRepo: undefined,
          },
        };

        setSubmissionData(newVulnerabilityData);
        sendSubmissionToServer(newVulnerabilityData);
      }
    },
  });

  const reset = () => {
    callReset();
    setSubmissionData(SUBMISSION_INIT_DATA);
    setCurrentStep(0);
    setAllFormDisabled(false);
  };

  // Loads initial state of the vault
  useEffect(() => {
    if (!activeVaults || activeVaults.length === 0) return;

    try {
      let cachedData: ISubmissionData = JSON.parse(
        localStorage.getItem(LocalStorage.SubmitVulnerability) || JSON.stringify(SUBMISSION_INIT_DATA)
      );

      const projectIdParams = searchParams.get("projectId");
      if (projectIdParams) {
        const projectFound = activeVaults.find((vault) => vault.id === projectIdParams);
        if (projectFound && projectFound.description) {
          cachedData.project = {
            verified: true,
            projectId: projectIdParams,
            projectName: projectFound.description["project-metadata"].name,
          };
        }
      }

      if (cachedData.submissionResult && cachedData.submissionResult?.chainId !== chain?.id) {
        setSubmissionData(SUBMISSION_INIT_DATA);
      } else if (cachedData.project?.projectId && !activeVaults?.find((vault) => vault.id === cachedData.project?.projectId)) {
        setSubmissionData(SUBMISSION_INIT_DATA);
      } else if (cachedData.version !== getAppVersion()) {
        setSubmissionData(SUBMISSION_INIT_DATA);
      } else {
        if (cachedData.ref === "audit-wizard") setAllFormDisabled(true);
        setSubmissionData(cachedData);
      }
    } catch (e) {
      setSubmissionData(SUBMISSION_INIT_DATA);
    }
  }, [activeVaults, chain, searchParams]);

  // Save data to local storage
  useEffect(() => {
    if (!submissionData) return;
    localStorage.setItem(LocalStorage.SubmitVulnerability, JSON.stringify(submissionData));
  }, [submissionData]);

  // Finds current step and set it
  useEffect(() => {
    if (!submissionData) return;

    const firstInvalidStepIdx = steps.findIndex(
      (step) => !submissionData[SubmissionStep[step.card]] || !submissionData[SubmissionStep[step.card]].verified
    );
    if (firstInvalidStepIdx === -1) setCurrentStep(steps.length - 1);
    else setCurrentStep(firstInvalidStepIdx);
  }, [submissionData, steps]);

  const sendSubmissionToServer = useCallback(
    async (data: ISubmissionData) => {
      if (!vault || !data || !data.submissionResult) return;

      setSubmissionData({
        ...data,
        submissionResult: { ...data.submissionResult, botStatus: SubmissionOpStatus.Pending, auditCompetitionRepo: undefined },
      });

      try {
        const res = await submitVulnerabilitySubmission(data, vault, hackerProfile);

        if (res.success) {
          setSubmissionData({
            ...data,
            submissionResult: {
              ...data.submissionResult,
              botStatus: SubmissionOpStatus.Success,
              auditCompetitionRepo: res.auditCompetitionRepo,
            },
          });
        } else throw new Error("Failed to submit vulnerability");
      } catch {
        setSubmissionData({
          ...data,
          submissionResult: { ...data.submissionResult, botStatus: SubmissionOpStatus.Fail, auditCompetitionRepo: undefined },
        });
      }
    },
    [vault, hackerProfile]
  );

  const submitSubmission = useCallback(async () => {
    if (!vault) return;
    if (!submissionData?.submissionsDescriptions?.submission) return;

    // Check if vault requires message signature to submit
    if (requireMessageSignature && !userHasCollectedSignature) {
      const wantsToBeRedirected = await confirm({
        title: t("youNeedToSignMessageToSubmit"),
        titleIcon: <ErrorIcon className="mr-2" fontSize="large" />,
        description: t("youNeedToSignMessageToSubmitExplanation"),
        cancelText: t("close"),
        confirmText: t("gotIt"),
      });

      if (!wantsToBeRedirected) return;

      const isAudit = vault?.description?.["project-metadata"].type === "audit";
      const name = vault?.description?.["project-metadata"].name ?? "";

      const mainRoute = `/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
      const vaultSlug = slugify(name);

      return navigate(`${mainRoute}/${vaultSlug}-${vault.id}`);
    }

    const submission = submissionData?.submissionsDescriptions?.submission;
    const calculatedCid = await calcCid(submission);

    if (submissionData.ref === "audit-wizard") {
      if (!submissionData.auditWizardData) return;
      // Verify if the submission was not changed and validate the signature
      const auditwizardSubmission = getCurrentAuditwizardSubmission(submissionData.auditWizardData, submissionData);

      if (JSON.stringify(submissionData.auditWizardData) !== JSON.stringify(auditwizardSubmission)) {
        return confirm({
          title: t("submissionChanged"),
          titleIcon: <ErrorIcon className="mr-2" fontSize="large" />,
          description: t("submissionChangedExplanationAuditWizard"),
          confirmText: t("gotIt"),
        });
      }

      const res = await verifyAuditWizardSignature(auditwizardSubmission);
      if (!res) {
        return confirm({
          title: t("submissionNotValid"),
          titleIcon: <ErrorIcon className="mr-2" fontSize="large" />,
          description: t("submissionNotValidExplanationAuditWizard"),
          confirmText: t("gotIt"),
        });
      }
    }

    sendVulnerabilityOnChain(calculatedCid);
  }, [sendVulnerabilityOnChain, submissionData, confirm, requireMessageSignature, userHasCollectedSignature, navigate, vault, t]);

  const handleClearSubmission = async () => {
    const wantsToClear = await confirm({
      title: t("clearSubmission"),
      titleIcon: <ClearIcon className="mr-2" fontSize="large" />,
      description: t("clearSubmissionExplanation"),
      cancelText: t("no"),
      confirmText: t("clearForm"),
    });

    if (!wantsToClear) return;
    reset();
  };

  const populateDataFromAuditWizard = async (auditWizardSubmission: IAuditWizardSubmissionData) => {
    if (!vaultsReadyAllChains) return;

    if (submissionData?.project?.projectId) {
      const wantsToClear = await confirm({
        title: t("existingSubmission"),
        titleIcon: <ClearIcon className="mr-2" fontSize="large" />,
        description: t("clearExistingSubmissionAuditWizardExplanation"),
        cancelText: t("no"),
        confirmText: t("clearForm"),
      });
      if (!wantsToClear) return;
    }

    reset();

    const vault = activeVaults && activeVaults.find((vault) => vault.id === auditWizardSubmission.project.projectId);
    if (!vault || !vault.description) {
      return confirm({
        title: t("projectNotAvailable"),
        titleIcon: <ErrorIcon className="mr-2" fontSize="large" />,
        description: t("projectNotAvailableExplanation"),
        confirmText: t("gotIt"),
      });
    }

    setSubmissionData((prev) => ({
      ...prev!,
      ref: "audit-wizard",
      auditWizardData: auditWizardSubmission,
      project: {
        verified: true,
        projectName: vault.description?.["project-metadata"].name!,
        ...auditWizardSubmission.project,
      },
      terms: { verified: false },
      contact: { verified: false, ...auditWizardSubmission.contact },
      submissionsDescriptions: {
        verified: false,
        submission: "",
        submissionMessage: "",
        descriptions: auditWizardSubmission.submissionsDescriptions.descriptions.map((desc: any) => ({
          type: "new", // or "complement" based on your logic
          complementTestFiles: [],
          complementFixFiles: [],
          title: desc.title,
          description: desc.description,
          severity: desc.severity,
          isEncrypted: desc.isEncrypted,
          files: desc.files || [],
          testNotApplicable: false,
          needsFix: false,
          needsTest: false,
        })),
      },
      submissionResult: undefined,
    }));
    setAllFormDisabled(true);
  };

  useEffect(() => {
    const checkEvent = (event: MessageEvent) => {
      const host = new URL(event.origin).host;
      if (IS_PROD && host !== "app.auditwizard.io") return;
      if (!event.data.signature || !event.data.project || !event.data.contact) return;

      setReceivedSubmissionAuditwizard(event.data);
    };

    window.addEventListener("message", checkEvent);

    return () => {
      window.removeEventListener("message", checkEvent);
    };
  }, []);

  // Populate data from audit wizard once vaults are ready
  useEffect(() => {
    if (!vaultsReadyAllChains) return;
    if (!receivedSubmissionAuditwizard) return;

    populateDataFromAuditWizard(receivedSubmissionAuditwizard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultsReadyAllChains, receivedSubmissionAuditwizard]);

  const context: ISubmissionFormContext = {
    reset,
    vault,
    currentStep,
    setCurrentStep,
    submissionData,
    setSubmissionData,
    submitSubmission,
    sendSubmissionToServer,
    isSubmitting,
    isSigningSubmission,
    allFormDisabled,
  };

  return (
    <>
      <Seo title={t("seo.submitVulnerabilityTitle")} />
      <StyledSubmissionFormPage className="content-wrapper">
        <div className="top-controls">
          {submissionData?.ref === "audit-wizard" && (
            <div className="auditWizardSubmission">
              <img src={require("assets/images/audit_wizard.png")} alt="audit wizard logo" />
              <p>{t("Submissions.submissionSubmittedViaAuditWizard")}</p>
            </div>
          )}
          {submissionData?.project?.projectId && (
            <Button styleType="invisible" textColor="error" onClick={handleClearSubmission}>
              <ClearIcon className="mr-2" />
              {t("clearSubmission")}
            </Button>
          )}
        </div>

        <div id="vulnerabilityFormWrapper" className="accordion-wrapper">
          <SubmissionFormContext.Provider value={context}>
            {steps.map((step, index) => (
              <SubmissionFormCard
                extraInfoTitle={index === 0 ? submissionData?.project?.projectName : ""}
                id={index}
                key={index}
                title={step.title}
                collapsed={currentStep !== index}
                verified={submissionData?.[SubmissionStep[step.card]]?.verified}
                disabled={isSubmitting}
              >
                {<step.component />}
              </SubmissionFormCard>
            ))}
          </SubmissionFormContext.Provider>
        </div>
      </StyledSubmissionFormPage>

      {requireMessageSignature && isLoadingCollectedSignature && <Loading fixed extraText={`${t("loading")}...`} />}
    </>
  );
};
