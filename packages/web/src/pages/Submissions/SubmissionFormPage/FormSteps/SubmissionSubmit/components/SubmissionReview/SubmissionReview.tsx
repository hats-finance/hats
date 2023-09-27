import { allowedElementsMarkdown } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { Alert, Button, FormInput, Loading } from "components";
import { SubmissionFormContext } from "pages/Submissions/SubmissionFormPage/store";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { StyledSubmissionReview } from "./styles";

export function SubmissionReview() {
  const { t } = useTranslation();
  const { address: account } = useAccount();

  const { submissionData, isSubmitting, isSigningSubmission, submitSubmission, vault } = useContext(SubmissionFormContext);

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

      <br />

      <MDEditor.Markdown
        allowedElements={allowedElementsMarkdown}
        source={submissionData?.submissionsDescriptions?.submissionMessage}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent", color: "var(--white)" }}
      />

      {/* <FormInput readOnly type="textarea" rows={20} value={submissionData?.submissionsDescriptions?.submissionMessage} /> */}

      <div className="buttons">
        {/* {submissionData.ref === "audit-wizard" && (
          <Button
            filledColor="secondary"
            disabled={isSubmitting || isSigningSubmission}
            bigHorizontalPadding
            onClick={() => submitSubmission()}
          >
            {t("Submissions.editSubmission")}
          </Button>
        )} */}
        <Button disabled={isSubmitting || isSigningSubmission} bigHorizontalPadding onClick={() => submitSubmission()}>
          {t("submit")}
        </Button>
      </div>

      {isSigningSubmission && <Loading fixed extraText={`${t("Submissions.executeTransactionInYourWallet")}...`} />}
      {isSubmitting && <Loading fixed extraText={`${t("Submissions.submittingVulnerabilities")}...`} />}
    </StyledSubmissionReview>
  );
}
