import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { useContext } from "react";
import SubmitProcessed from "./components/SubmissionProcessed/SubmissionProcessed";
import SubmitReview from "./components/SubmissionReview/SubmissionReview";
import "./index.scss";

export function SubmissionSubmit() {
  const { submissionData } = useContext(SubmissionFormContext);

  return (
    <div className="submit-wrapper card-content">
      {submissionData?.submissionResult?.verified ? <SubmitProcessed /> : <SubmitReview />}
    </div>
  );
}
