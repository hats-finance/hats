import { ISubmittedSubmission, IVulnerabilitySeverity } from "@hats.finance/shared";
import ArrowIcon from "@mui/icons-material/ArrowForwardOutlined";
import BoxUnselected from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import BoxSelected from "@mui/icons-material/CheckBoxOutlined";
import { Pill, WithTooltip } from "components";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { parseSeverityName } from "utils/severityName";
import { StyledSubmissionCard } from "./styles";

type SubmissionCardProps = {
  submission: ISubmittedSubmission;
  noActions?: boolean;
  inPayout?: boolean;
  isChecked?: boolean;
  onCheckChange?: (submission: ISubmittedSubmission) => void;
};

export const SubmissionCard = ({
  submission,
  onCheckChange,
  noActions = false,
  isChecked = false,
  inPayout = false,
}: SubmissionCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  console.log(submission);
  const vault = submission.linkedVault;
  const submissionData = submission.submissionDataStructure;
  const commChannel = submissionData?.communicationChannel;
  const severityColors = getSeveritiesColorsArray(vault);

  const createdAt = new Date(+submission.createdAt * 1000);

  const severityIndex =
    submissionData?.severity &&
    vault?.description?.severities.findIndex((sev: IVulnerabilitySeverity) =>
      sev.name.toLowerCase().includes(submissionData.severity ?? "")
    );

  const openSubmissionNewTab = () => {
    window.open(`${window.location.origin}${RoutePaths.committee_tools}/submissions/${submission.subId}`, "_blank");
  };

  const navigateSubmissionDetails = () => {
    navigate(`${RoutePaths.committee_tools}/submissions/${submission.subId}`);
  };

  return (
    <StyledSubmissionCard noActions={noActions} inPayout={inPayout} isChecked={isChecked} noSeverity={!submissionData?.severity}>
      {onCheckChange && (
        <div className="select-check" onClick={() => onCheckChange(submission)}>
          {isChecked ? <BoxSelected fontSize="inherit" /> : <BoxUnselected fontSize="inherit" />}
        </div>
      )}
      <div className="content-container" onClick={() => !noActions && !inPayout && navigateSubmissionDetails()}>
        <WithTooltip text={vault?.description?.["project-metadata"].name}>
          <img src={ipfsTransformUri(vault?.description?.["project-metadata"].icon)} alt="project logo" />
        </WithTooltip>
        <div className="content">
          {submissionData?.severity && (
            <span className="severity">
              <Pill
                textColor={severityColors[severityIndex ?? 0]}
                isSeverity
                text={parseSeverityName(submissionData?.severity) ?? t("noSeverity")}
              />
            </span>
          )}
          <p className="submission-title">{submissionData?.title}</p>
          <div className="hacker-details">
            <WithTooltip text={submissionData?.beneficiary}>
              <span>{shortenIfAddress(submissionData?.beneficiary)}</span>
            </WithTooltip>
            {commChannel && (
              <span>
                {commChannel?.value} ({commChannel?.type})
              </span>
            )}
            {submissionData?.githubUsername &&
              submissionData?.githubUsername !== "--" &&
              submissionData?.githubUsername !== "---" && <span>Github: {submissionData?.githubUsername}</span>}
            {submissionData?.twitterUsername &&
              submissionData?.twitterUsername !== "--" &&
              submissionData?.twitterUsername !== "---" && <span>Twitter (X): {submissionData?.twitterUsername}</span>}
          </div>
        </div>
        <div className="date">{moment(createdAt).format("Do MMM YYYY - hh:mma")}</div>
        <div className="details" onClick={() => inPayout && openSubmissionNewTab()}>
          {t("seeSubmissionDetails")} <ArrowIcon />
        </div>
      </div>
    </StyledSubmissionCard>
  );
};
