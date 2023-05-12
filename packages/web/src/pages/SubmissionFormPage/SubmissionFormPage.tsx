import { axiosClient } from "config/axiosClient";
import { LocalStorage } from "constants/constants";
import { LogClaimContract } from "contracts";
import { useVaults } from "hooks/vaults/useVaults";
import { calcCid } from "pages/SubmissionFormPage/encrypt";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_SERVICE_URL } from "settings";
import { getAppVersion } from "utils";
import { useNetwork, useWaitForTransaction } from "wagmi";
import {
  SubmissionContactInfo,
  SubmissionDescriptions,
  SubmissionProject,
  SubmissionSubmit,
  SubmissionTermsAndProcess,
} from "./FormSteps";
import SubmissionFormCard from "./SubmissionFormCard/SubmissionFormCard";
import { ISubmissionFormContext, SUBMISSION_INIT_DATA, SubmissionFormContext } from "./store";
import { StyledSubmissionFormPage } from "./styles";
import { ISubmissionData, SubmissionOpStatus, SubmissionStep } from "./types";

export const SubmissionFormPage = () => {
  const { t } = useTranslation();

  const { vaults } = useVaults();
  const { chain } = useNetwork();
  const [currentStep, setCurrentStep] = useState<number>();
  const [submissionData, setSubmissionData] = useState<ISubmissionData>();
  const vault = (vaults ?? []).find((vault) => vault.id === submissionData?.project?.projectId);

  const steps = useMemo(
    () => [
      { title: t("Submissions.selectProject"), component: SubmissionProject, card: SubmissionStep.project },
      { title: t("Submissions.termsAndProcess"), component: SubmissionTermsAndProcess, card: SubmissionStep.terms },
      { title: t("Submissions.contactInformation"), component: SubmissionContactInfo, card: SubmissionStep.contact },
      {
        title: t("Submissions.describeVulnerability"),
        component: SubmissionDescriptions,
        card: SubmissionStep.submissionsDescriptions,
      },
      { title: t("Submissions.submit"), component: SubmissionSubmit, card: SubmissionStep.submission },
    ],
    [t]
  );

  const { data: callData, reset: callReset, send: sendVulnerabilityOnChain } = LogClaimContract.hook(vault);
  const { isLoading: isSubmitting } = useWaitForTransaction({
    hash: callData?.hash,
    onSettled(data, error) {
      if (error) return reset();

      if (submissionData && data?.transactionHash && chain?.id) {
        const newVulnerabilityData = {
          ...submissionData,
          submission: {
            verified: true,
            txStatus: !error && data.status === 1 ? SubmissionOpStatus.Success : SubmissionOpStatus.Fail,
            botStatus: SubmissionOpStatus.Pending,
            transactionHash: data?.transactionHash,
            chainId: chain?.id,
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
  };

  // Loads initial state of the vault
  useEffect(() => {
    if (!vaults || vaults.length === 0) return;

    try {
      let cachedData: ISubmissionData = JSON.parse(
        localStorage.getItem(LocalStorage.SubmitVulnerability) || JSON.stringify(SUBMISSION_INIT_DATA)
      );

      if (cachedData.submissionResult && cachedData.submissionResult?.chainId !== chain?.id) {
        setSubmissionData(SUBMISSION_INIT_DATA);
      } else if (cachedData.project?.projectId && !vaults?.find((vault) => vault.id === cachedData.project?.projectId)) {
        setSubmissionData(SUBMISSION_INIT_DATA);
      } else if (cachedData.version !== getAppVersion()) {
        setSubmissionData(SUBMISSION_INIT_DATA);
      } else {
        setSubmissionData(cachedData);
      }
    } catch (e) {
      setSubmissionData(SUBMISSION_INIT_DATA);
    }
  }, [vaults, chain]);

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

  const sendSubmissionToServer = useCallback(async (data: ISubmissionData) => {
    if (!data) return;
    setSubmissionData((prev) => ({
      ...prev!,
      submissionResult: { ...prev!.submissionResult!, botStatus: SubmissionOpStatus.Pending },
    }));

    try {
      const payload = {
        txHash: data.submissionResult?.transactionHash,
        chainId: data.submissionResult?.chainId,
        msg: data.submissionsDescriptions?.submissionMessage,
        route: data.project?.projectName,
        projectId: data.project?.projectId,
      };

      const res = await axiosClient.post(`${BASE_SERVICE_URL}/messages/broadcast-message`, payload);

      if (res.status === 200) {
        setSubmissionData((prev) => ({
          ...prev!,
          submissionResult: { ...prev!.submissionResult!, botStatus: SubmissionOpStatus.Success },
        }));
      } else {
        setSubmissionData((prev) => ({
          ...prev!,
          submissionResult: { ...prev!.submissionResult!, botStatus: SubmissionOpStatus.Fail },
        }));
      }
    } catch {
      setSubmissionData((prev) => ({
        ...prev!,
        submissionResult: { ...prev!.submissionResult!, botStatus: SubmissionOpStatus.Fail },
      }));
    }
  }, []);

  const submitSubmission = useCallback(async () => {
    if (!submissionData?.submissionsDescriptions?.submissionMessage) return;
    const submissionMessage = submissionData?.submissionsDescriptions?.submissionMessage;
    const calculatedCid = await calcCid(submissionMessage);
    sendVulnerabilityOnChain(calculatedCid);
  }, [sendVulnerabilityOnChain, submissionData]);

  const context: ISubmissionFormContext = {
    reset,
    currentStep,
    setCurrentStep,
    submissionData,
    setSubmissionData,
    submitSubmission,
    sendSubmissionToServer,
    submittingSubmission: isSubmitting,
  };

  return (
    <StyledSubmissionFormPage className="content-wrapper">
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
  );
};
