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
import { submitVulnerabilitySubmission } from "./submissionsService.api";
import { ISubmissionData, SubmissionOpStatus, SubmissionStep } from "./types";

const auditWizardExample = JSON.parse(`{
  "project": {
      "projectId": "0x18fbe473b99b3d68f5ad35881149ea0e1b56e091"
  },
  "signature": "15bcdbe3bf773174702edd02067437d59d8f3f963cebd8661a83baf89cb75bc4d4e55653e7a1f0357f5532e9ea40b4eb78a4cbbe9bc51130505b64976fa1238de8920bc23312a0c5f9f3a772ce29cfd2ad39a9d18572173621fbc99cb7a31ca9538ff468e0ab743ba202667fcd24870e5d0d14eb6a8a0adfb5d23db208e427dd83ab757e4cf0d0dc8da215f18bb2587d94cfa94e40bf7f8e03dee0e02bc5a14bd3829b9d8d25884397b432aef10aa361431d8f59fc5a97e5a129e507509cdf36b1052d7d432c0701c5dfbe92ef532bf6c38a340c98a05b53a8856ff1f3afd97297815a1b82ae0cd2e71166706232a03eb9fc24c1db70ae273632fc658b28ab61",
  "contact": {
      "beneficiary": "0x56E889664F5961452E5f4183AA13AF568198eaD2",
      "communicationChannel": "test@auditware.io",
      "communicationChannelType": "email"
  },
  "submissionDescriptions": {
      "descriptions": [
          {
              "title": "Malicious pair can re-enter 'VeryFastRouter' to drain funds",
              "description": "VeryFastRouter::swap is the main entry point for a user to perform a batch of sell and buy orders on the new Sudoswap router, allowing partial fill conditions to be specified. Sell orders are executed first, followed by buy orders. The LSSVMPair contracts themselves are implemented in such a way that re-entrancy is not possible, but the same is not true of the VeryFastRouter. Assuming a user calls VeryFastRouter::swap, selling some NFTs and passing in some additional ETH value for subsequent buy orders, an attacker can re-enter this function under certain conditions to steal the original caller's funds. Given that this function does not check whether the user input contains valid pairs, an attacker can use this to manipulate",
              "severity": "high severity",
              "files": ["base64", "base64"]
          },
          {
              "title": "Lack of Input Validation in Transfer Function",
              "description": "The smart contract being audited exhibits a low severity issue related to the lack of input validation in the transfer function. The contract allows users to transfer tokens between addresses, but it fails to adequately validate the input parameters, which can lead to potential vulnerabilities.",
              "severity": "Low",
              "files": ["base64"]
          }
      ]
  }
}`);

export const SubmissionFormPage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const [searchParams] = useSearchParams();
  const { chain } = useNetwork();
  const [currentStep, setCurrentStep] = useState<number>();
  const [submissionData, setSubmissionData] = useState<ISubmissionData>();
  const [allFormDisabled, setAllFormDisabled] = useState(false);

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

    sendVulnerabilityOnChain(calculatedCid);
  }, [sendVulnerabilityOnChain, submissionData]);

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

  window.addEventListener("message", function (event) {
    // Check the origin of the sender
    // if (event.origin === 'http://localhost:3000') {
    // Process the received data
    console.log("Received message:", event.data);
    populateDataFromAuditWizard(event.data);
    // } else {
    //   // Ignore messages from untrusted origins
    //   console.warn('Received message from untrusted origin:', event.origin);
    // }
  });

  const populateDataFromAuditWizard = async (auditWizardSubmission: any) => {
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
        descriptions: auditWizardSubmission.submissionDescriptions.descriptions.map((desc: any) => {
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
      <Button
        className="mb-4"
        styleType="invisible"
        textColor="error"
        onClick={() => populateDataFromAuditWizard(auditWizardExample)}
      >
        <ClearIcon className="mr-2" />
        {"TEST"}
      </Button>
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
