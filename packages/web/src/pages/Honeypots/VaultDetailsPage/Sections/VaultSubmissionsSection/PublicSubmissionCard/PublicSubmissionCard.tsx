import { IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { Pill } from "components";
import { disallowedElementsMarkdown } from "constants/constants";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import moment from "moment";
import { IGithubIssue } from "pages/Honeypots/VaultDetailsPage/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledPublicSubmissionCard } from "./styles";

type PublicSubmissionCardProps = {
  vault: IVault;
  submission: IGithubIssue;
};

function PublicSubmissionCard({ vault, submission }: PublicSubmissionCardProps) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const severityColors = getSeveritiesColorsArray(vault);
  const severityIndex =
    submission.severity &&
    vault?.description?.severities.findIndex((sev: IVulnerabilitySeverity) =>
      sev.name.toLowerCase().includes(submission.severity ?? "")
    );

  return (
    <StyledPublicSubmissionCard isOpen={isOpen}>
      <div className="card-header" onClick={() => setIsOpen((prev) => !prev)}>
        <div className="severity">
          <Pill textColor={severityColors[severityIndex ?? 0]} isSeverity text={submission.severity ?? t("noSeverity")} />
        </div>
        <p className="date">{moment(submission.createdAt).format("Do MMM YYYY - hh:mma")}</p>
        <p className="submission-title">{submission.issueData.issueTitle}</p>
      </div>

      <div className="card-content">
        <MDEditor.Markdown
          disallowedElements={disallowedElementsMarkdown}
          className="submission-content"
          source={submission.issueData.issueDescription
            .replace("\n**Submission hash", "\\\n**Submission hash")
            .replace("\n**Severity:**", "\\\n**Severity:**")}
        />
      </div>
    </StyledPublicSubmissionCard>
  );
}

export default PublicSubmissionCard;
