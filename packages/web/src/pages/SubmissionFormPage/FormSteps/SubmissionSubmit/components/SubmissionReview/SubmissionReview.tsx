import EditIcon from "assets/icons/edit.svg";
import { Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import "./index.scss";

export default function SubmitReview() {
  const { t } = useTranslation();
  const { address: account } = useAccount();

  const { submissionData, submittingSubmission, submitSubmission, setCurrentStep } = useContext(SubmissionFormContext);

  const { vaults } = useVaults();
  const vault = vaults?.find((vault) => vault.id === submissionData?.project?.projectId)!;

  const isSupportedNetwork = useSupportedNetwork();
  const isVerified =
    submissionData?.project?.verified &&
    submissionData?.contact?.verified &&
    submissionData?.submissionsDescriptions?.verified &&
    submissionData?.terms?.verified;
  const committeeCheckedIn = vault && vault.committeeCheckedIn;

  const showSubmitWarning = !isVerified || !account;

  const handleSubmit = async () => {
    submitSubmission();
  };

  return (
    <div className="submit-review-wrapper">
      {t("SubmitVulnerability.Submit.review-notice")}

      <div className="review-details-container">
        <div className="project-and-contact-container">
          <div className="review-item project-name-item">
            <div className="item-title-container">
              <span>Project Name:</span>
              <img src={EditIcon} alt="edit" onClick={() => setCurrentStep(0)} />
            </div>
            <span className="item-value">{submissionData?.project?.projectName}</span>
          </div>
          <div className="review-item">
            <div className="item-title-container">
              <span>Contact Information:</span>
              <img src={EditIcon} alt="edit" onClick={() => setCurrentStep(1)} />
            </div>
            <span className="item-value">{submissionData?.contact?.communicationChannel}</span>
          </div>
        </div>

        <div className="description-container">
          <div className="review-item">
            <div className="item-title-container">
              <span>Vulnerability Description:</span>
              <img src={EditIcon} alt="edit" onClick={() => setCurrentStep(2)} />
            </div>
            <span className="item-value">{submissionData?.submissionsDescriptions?.description}</span>
          </div>
        </div>
      </div>

      <button
        disabled={!isVerified || submittingSubmission || !account || (vault && !committeeCheckedIn) || !isSupportedNetwork}
        onClick={handleSubmit}
      >
        SUBMIT
      </button>
      {vault && !committeeCheckedIn && <span className="error-label">COMMITTEE IS NOT CHECKED IN YET!</span>}
      {showSubmitWarning && (
        <span className="error-label">{`Please make sure you completed all steps and your wallet is connected.`}</span>
      )}
      {submittingSubmission && (
        <Loading
          fixed
          extraText="Submitting might take longer than usual"
          domElement={document.getElementById("vulnerabilityFormWrapper") as HTMLElement}
          zIndex={0}
        />
      )}
    </div>
  );
}
