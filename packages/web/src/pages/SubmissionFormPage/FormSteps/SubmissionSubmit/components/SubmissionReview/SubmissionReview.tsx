import EditIcon from "assets/icons/edit.svg";
import { Alert, Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
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
  const vault = vaults?.find((vault) => vault.id === submissionData?.project?.projectId);

  const areAllStepsVerified =
    submissionData?.project?.verified &&
    submissionData?.contact?.verified &&
    submissionData?.submissionsDescriptions?.verified &&
    submissionData?.terms?.verified;

  const handleSubmit = async () => {
    submitSubmission();
  };

  if (vault && !vault.committeeCheckedIn) return <Alert type="error">{t("Submissions.committeeNotCheckedInError")}</Alert>;
  if (!account) return <Alert type="error">{t("Submissions.pleaseConnectYourWallet")}</Alert>;
  if (!areAllStepsVerified) return <Alert type="error">{t("Submissions.firstCompleteAllTheSteps")}</Alert>;

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

      <button disabled={submittingSubmission || !account || !vault} onClick={() => submitSubmission()}>
        SUBMIT
      </button>

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
