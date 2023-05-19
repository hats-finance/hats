import { Alert, Button, FormInput, Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { SubmissionFormContext } from "pages/Submissions/SubmissionFormPage/store";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { StyledSubmissionReview } from "./styles";

export function SubmissionReview() {
  const { t } = useTranslation();
  const { address: account } = useAccount();

  const { submissionData, isSubmitting, isSigningSubmission, submitSubmission } = useContext(SubmissionFormContext);

  const { vaults } = useVaults();
  const vault = vaults?.find((vault) => vault.id === submissionData?.project?.projectId);

  const areAllStepsVerified =
    submissionData?.project?.verified &&
    submissionData?.contact?.verified &&
    submissionData?.submissionsDescriptions?.verified &&
    submissionData?.terms?.verified;

  if (vault && !vault.committeeCheckedIn) return <Alert type="error">{t("Submissions.committeeNotCheckedInError")}</Alert>;
  if (!account) return <Alert type="error">{t("Submissions.pleaseConnectYourWallet")}</Alert>;
  if (!areAllStepsVerified) return <Alert type="error">{t("Submissions.firstCompleteAllTheSteps")}</Alert>;

  return (
    <StyledSubmissionReview>
      <p className="mb-4">{t("Submissions.pleaseReviewYourSubmission")}</p>

      <div className="row mt-4">
        <FormInput readOnly value={submissionData?.project?.projectName} label={t("Submissions.projectName")} />
        <FormInput
          readOnly
          value={submissionData?.contact?.communicationChannel}
          label={`${t("contact")} (${submissionData?.contact?.communicationChannelType})`}
        />
      </div>

      <FormInput readOnly type="textarea" rows={20} value={submissionData?.submissionsDescriptions?.submissionMessage} />

      <Button disabled={isSubmitting || isSigningSubmission} expanded onClick={() => submitSubmission()}>
        {t("submit")}
      </Button>

      {isSigningSubmission && <Loading fixed extraText={`${t("Submissions.executeTransactionInYourWallet")}...`} />}
      {isSubmitting && <Loading fixed extraText={`${t("Submissions.submittingVulnerabilities")}...`} />}
    </StyledSubmissionReview>
  );
}
