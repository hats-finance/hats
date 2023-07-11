import { ISubmittedSubmission } from "@hats-finance/shared";
import ArrowIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Pill, WithTooltip } from "components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledSubmissionCard } from "./styles";

type SubmissionCardProps = {
  submission: ISubmittedSubmission;
};

export const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const { t } = useTranslation();
  const vault = submission.linkedVault;
  const submissionData = submission.submissionDataStructure;
  const commChannel = submissionData?.communicationChannel;

  const createdAt = new Date(+submission.createdAt * 1000);

  return (
    <StyledSubmissionCard>
      <img src={ipfsTransformUri(vault?.description?.["project-metadata"].icon)} alt="project logo" />
      <div className="content">
        {submissionData?.severity && <Pill isSeverity text={submissionData?.severity ?? t("noSeverity")} />}
        <p className="submission-title">{submissionData?.title}</p>
        <div className="hacker-details">
          <WithTooltip text={submissionData?.beneficiary}>
            <span>{shortenIfAddress(submissionData?.beneficiary)}</span>
          </WithTooltip>
          <span>
            {commChannel?.value} ({commChannel?.type})
          </span>
          {submissionData?.githubUsername &&
            submissionData?.githubUsername !== "--" &&
            submissionData?.githubUsername !== "---" && <span>Github: @{submissionData?.githubUsername}</span>}
        </div>
      </div>
      <div className="date">{moment(createdAt).format("Do MMM YYYY - hh:mm")}</div>
      <div className="details">
        {t("seeSubmissionDetails")} <ArrowIcon />
      </div>
    </StyledSubmissionCard>
  );
};
