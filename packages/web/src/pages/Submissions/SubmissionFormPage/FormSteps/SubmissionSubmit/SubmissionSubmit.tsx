import { SubmissionFormContext } from "pages/Submissions/SubmissionFormPage/store";
import { useContext } from "react";
import { SubmissionProcessed } from "./components/SubmissionProcessed/SubmissionProcessed";
import { SubmissionReview } from "./components/SubmissionReview/SubmissionReview";
import { StyledSubmissionSubmitWrapper } from "./styles";

export function SubmissionSubmit() {
  const { submissionData } = useContext(SubmissionFormContext);

  return (
    <StyledSubmissionSubmitWrapper>
      {submissionData?.submissionResult?.verified ? <SubmissionProcessed /> : <SubmissionReview />}
    </StyledSubmissionSubmitWrapper>
  );
}
