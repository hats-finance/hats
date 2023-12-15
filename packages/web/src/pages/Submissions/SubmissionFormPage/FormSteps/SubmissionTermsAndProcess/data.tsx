import { IVault } from "@hats.finance/shared";
import AwardIcon from "assets/icons/submission-terms/award.png";
import BugIcon from "assets/icons/submission-terms/bug.png";
import QuestionIcon from "assets/icons/submission-terms/question.png";
import TimelineIcon from "assets/icons/submission-terms/timeline.png";
import WarningIcon from "assets/icons/submission-terms/warning.png";
import { TFunction } from "i18next";

export const getSubmissionTermsContent = (vault: IVault, t: TFunction) => {
  const keyType = vault.description?.["project-metadata"].type === "audit" ? "auditCompetition" : "bugBounty";

  return <div dangerouslySetInnerHTML={{ __html: t(`Submissions.terms.${keyType}.submissionSection`) }} />;
};

export const getSubmissionFixRemedyContent = (vault: IVault, t: TFunction) => {
  const keyType = vault.description?.["project-metadata"].type === "audit" ? "auditCompetition" : "bugBounty";

  let contentText = t(`Submissions.terms.${keyType}.fixRemedySection`);
  contentText = contentText.replace("##question##", `<img src=${QuestionIcon} />`);
  contentText = contentText.replace("##award##", `<img src=${AwardIcon} />`);
  contentText = contentText.replace("##bug##", `<img src=${BugIcon} />`);
  contentText = contentText.replace("##timeline##", `<img src=${TimelineIcon} />`);
  contentText = contentText.replace("##warning##", `<img src=${WarningIcon} />`);

  return <div dangerouslySetInnerHTML={{ __html: contentText }} />;
};

export const getSubmissionAwardsContent = (vault: IVault, t: TFunction) => {
  const keyType = vault.description?.["project-metadata"].type === "audit" ? "auditCompetition" : "bugBounty";

  return <div dangerouslySetInnerHTML={{ __html: t(`Submissions.terms.${keyType}.awardsSection`) }} />;
};

export const getAlertTermsContent = (vault: IVault, t: TFunction) => {
  const keyType = vault.description?.["project-metadata"].type === "audit" ? "auditCompetition" : "bugBounty";

  return <div dangerouslySetInnerHTML={{ __html: t(`Submissions.terms.${keyType}.alertSection`) }} />;
};
