import { IVulnerabilitySeverity } from "@hats-finance/shared";
import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ClearIcon from "@mui/icons-material/HighlightOffOutlined";
import { Button, Seo } from "components";
import { LocalStorage } from "constants/constants";
import { LogClaimContract } from "contracts";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import { calcCid } from "pages/Submissions/SubmissionFormPage/encrypt";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { IS_PROD } from "settings";
import { getAppVersion } from "utils";
import { useNetwork, useWaitForTransaction } from "wagmi";
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

// const auditWizardExample = JSON.parse(`{
//   "signature": "47732adf56d4ff7e4b0d0d6d8f09217044a0b8c9d22c06fd2713f7ffc27d210816dcfd35ef3e51a54a4be82027e88bfbd2dd58c36364d51002668e21fe8a4fe2b05baa673fc7152903166b5ac19b5641772327b7567f169888f7214d0a42f219652c17c5da70cf2c1a02319b139875a1aac9405ef9f2fb9058c89e00381cfabf154751853a0e406086ad0faa82b2bd8b03ec0e4b844c954eef3e9226772258bc5de5d7b2d0b4f731dc3763b9632288595ae3b2e505fb8f4e69969f82d1c6988de485dffdb2de553918c97eb7adf50a1e2680880dce59706869eec758f12c457a1d57a24032d02e7ec027584e63ffa5921cffea10bf26d32a3ab3cfea45216488",
//   "project": {
//       "projectId": "0x18fbe473b99b3d68f5ad35881149ea0e1b56e091"
//   },
//   "contact": {
//       "beneficiary": "0x6085fBB553F125C0234b28dE7D4228F2873B3428",
//       "communicationChannel": "test@auditware.io",
//       "communicationChannelType": "email"
//   },
//   "submissionDescriptions": {
//       "descriptions": [
//           {
//               "title": "Malicious pair can re-enter 'VeryFastRouter' to drain funds",
//               "description": "VeryFastRouter::swap is the main entry point for a user to perform a batch of sell and buy orders on the new Sudoswap router, allowing partial fill conditions to be specified. Sell orders are executed first, followed by buy orders. The LSSVMPair contracts themselves are implemented in such a way that re-entrancy is not possible, but the same is not true of the VeryFastRouter. Assuming a user calls VeryFastRouter::swap, selling some NFTs and passing in some additional ETH value for subsequent buy orders, an attacker can re-enter this function under certain conditions to steal the original caller's funds. Given that this function does not check whether the user input contains valid pairs, an attacker can use this to manipulate",
//               "severity": "Critical"
//           },
//           {
//               "title": "Lack of Input Validation in Transfer Function",
//               "description": "The smart contract being audited exhibits a low severity issue related to the lack of input validation in the transfer function. The contract allows users to transfer tokens between addresses, but it fails to adequately validate the input parameters, which can lead to potential vulnerabilities.",
//               "severity": "Low"
//           }
//       ]
//   }
// }`);

export const SubmissionFormPage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const [searchParams] = useSearchParams();
  const { chain } = useNetwork();
  const [currentStep, setCurrentStep] = useState<number>();
  const [submissionData, setSubmissionData] = useState<ISubmissionData>();
  const [allFormDisabled, setAllFormDisabled] = useState(false);
  const [receivedSubmissionAuditwizard, setReceivedSubmissionAuditwizard] = useState<IAuditWizardSubmissionData | undefined>();

  const { activeVaults, vaultsReadyAllChains } = useVaults();
  const vault = (activeVaults ?? []).find((vault) => vault.id === submissionData?.project?.projectId);

  const steps = useMemo(
    () => [
      { title: t("Submissions.selectProject"), component: SubmissionProject, card: SubmissionStep.project },
      { title: t("Submissions.termsAndProcess"), component: SubmissionTermsAndProcess, card: SubmissionStep.terms },
      { title: t("Submissions.communicationChannel"), component: SubmissionContactInfo, card: SubmissionStep.contact },
      {
        title: t("Submissions.describeVulnerability"),
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
        const res = await submitVulnerabilitySubmission(data, vault);

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
    [vault]
  );

  const submitSubmission = useCallback(async () => {
    if (!submissionData?.submissionsDescriptions?.submission) return;
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
  }, [sendVulnerabilityOnChain, submissionData, confirm, t]);

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
        descriptions: auditWizardSubmission.submissionsDescriptions.descriptions.map((desc: any) => {
          const severity = (vault.description?.severities as IVulnerabilitySeverity[]).find(
            (sev) =>
              desc.severity.toLowerCase()?.includes(sev.name.toLowerCase()) ||
              sev.name.toLowerCase()?.includes(desc.severity.toLowerCase())
          );
          return {
            title: desc.title,
            description: desc.description,
            severity: severity?.name.toLowerCase() ?? desc.severity.toLowerCase(),
            isEncrypted: !severity?.decryptSubmissions,
            files: [],
          };
        }),
      },
      submissionResult: undefined,
    }));
    setAllFormDisabled(true);
  };

  useEffect(() => {
    const checkEvent = (event: MessageEvent) => {
      if (IS_PROD && event.origin !== "https://www.auditwizard.io") return;
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
    </>
  );
};
