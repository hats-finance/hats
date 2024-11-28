import { GithubIssue, GithubPR, IVault, allowedElementsMarkdown, parseSeverityName } from "@hats.finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { Pill } from "components";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SplitPointsActions } from "./components/SplitPointsActions";
import { StyledPublicSubmissionCard } from "./styles";

type PublicSubmissionCardProps = {
  vault: IVault;
  submission: GithubIssue;
  linkedPRs?: GithubPR[];
};

function PublicSubmissionCard({ vault, submission, linkedPRs = [] }: PublicSubmissionCardProps) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const showExtraInfo = submission.number !== -1;
  const bonusPointsEnabled = vault.description?.["project-metadata"]?.bonusPointsEnabled;

  return (
    <StyledPublicSubmissionCard isOpen={isOpen}>
      <div className="card-header">
        <div onClick={() => setIsOpen((prev) => !prev)}>
          {submission && submission?.validLabels.length > 0 && (
            <div className="labels">
              <span>{t("labeledAs")}:</span>
              {submission.validLabels.map((label) => (
                <div className="label">
                  <Pill isSeverity text={parseSeverityName(label)} />
                </div>
              ))}
            </div>
          )}
          <p className="date">{moment(submission.createdAt).format("Do MMM YYYY - hh:mma")}</p>
          <p className="submission-title">
            {showExtraInfo ? <span>Issue #{submission.number}:</span> : ""} {submission.title}
          </p>
        </div>

        {showExtraInfo &&
          bonusPointsEnabled &&
          (submission.bonusPointsLabels.needsFix || submission.bonusPointsLabels.needsTest) && (
            <SplitPointsActions vault={vault} submission={submission} linkedPRs={linkedPRs} />
          )}
      </div>

      <div className="card-content">
        <MDEditor.Markdown
          allowedElements={allowedElementsMarkdown}
          className="submission-content"
          source={submission.body
            .replace("\n**Submission hash", "\\\n**Submission hash")
            .replace("\n**Severity:**", "\\\n**Severity:**")}
        />
      </div>
    </StyledPublicSubmissionCard>
  );
}

export default PublicSubmissionCard;
