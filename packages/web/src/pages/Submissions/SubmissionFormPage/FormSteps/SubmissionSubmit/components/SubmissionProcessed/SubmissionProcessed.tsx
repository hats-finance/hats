import DiscordIcon from "assets/icons/social/discord.icon";
import { Alert, Button, Dot } from "components";
import { Colors, SocialLinks } from "constants/constants";
import useModal from "hooks/useModal";
import { SubmissionFormContext } from "pages/Submissions/SubmissionFormPage/store";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SubmissionOpStatus } from "../../../../types";
import { SubmissionSuccessModal } from "../SubmissionSuccessModal/SubmissionSuccessModal";
import { StyledSubmissionProcessed } from "./styles";

export function SubmissionProcessed() {
  const { t } = useTranslation();
  const { isShowing: isShowingSuccessModal, show: showSuccessModal, hide: hideSuccessModal } = useModal();

  const { submissionData, sendSubmissionToServer, reset, vault } = useContext(SubmissionFormContext);
  const isAuditCompetition = vault?.description?.["project-metadata"].type === "audit";

  const submissionStatus = {
    onChain: submissionData?.submissionResult?.txStatus,
    server: submissionData?.submissionResult?.botStatus,
  };

  useEffect(() => {
    if (submissionStatus.server === SubmissionOpStatus.Success) setTimeout(showSuccessModal, 500);
  }, [submissionStatus.server, showSuccessModal]);

  const getSubmissionOnServerStatus = () => {
    let color = Colors.yellow;
    let text = t("pending");

    switch (submissionStatus.server) {
      case SubmissionOpStatus.Success:
        color = Colors.turquoise;
        text = t("success");
        break;
      case SubmissionOpStatus.Fail:
        color = Colors.red;
        text = t("failed");
        break;
    }

    return (
      <div className="item">
        <p>{t("Submissions.submissionSentToCommittee")}</p>

        <div className="status">
          <span>{t("status")}:</span>
          <Dot color={color} />
          <span>{text}</span>

          {submissionStatus.server !== SubmissionOpStatus.Success && (
            <Button
              className="ml-5"
              styleType="outlined"
              disabled={submissionStatus.server === SubmissionOpStatus.Pending}
              onClick={() => sendSubmissionToServer(submissionData)}
            >
              {t("Submissions.resendToServer")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const getSubmissionOnChainStatus = () => {
    let color = Colors.yellow;
    let text = t("pending");

    switch (submissionStatus.onChain) {
      case SubmissionOpStatus.Success:
        color = Colors.turquoise;
        text = t("success");
        break;
      case SubmissionOpStatus.Fail:
        color = Colors.red;
        text = t("failed");
        break;
    }

    return (
      <div className="item">
        <p>{t("Submissions.submissionOnChain")}</p>
        <div className="status">
          <span>{t("status")}:</span>
          <Dot color={color} />
          <span>{text}</span>
        </div>
      </div>
    );
  };

  const getAuditCompetitionRepoButton = () => {
    const repoName = submissionData?.submissionResult?.auditCompetitionRepo;
    if (!repoName) return null;

    return (
      <div className="mt-5">
        {`${t("youCan")} `}
        <Button
          className="audit-button mb-5"
          styleType="text"
          onClick={() =>
            window.open(`https://github.com/hats-finance/${submissionData?.submissionResult?.auditCompetitionRepo}/issues`)
          }
        >
          {t("Submissions.checkAuditCompetitionRepo").toLowerCase()}.
        </Button>
      </div>
    );
  };

  return (
    <StyledSubmissionProcessed>
      <p className="mb-5 bold">{t("Submissions.submissionSentThanks")}</p>

      <div className="submission-status">
        {getSubmissionOnChainStatus()}
        {getSubmissionOnServerStatus()}
      </div>

      {isAuditCompetition && getAuditCompetitionRepoButton()}

      {!isAuditCompetition && <Alert type="warning">{t("Submissions.responseNotice")}</Alert>}

      <p className="mt-5">{t("Submissions.whileWaitingJoinCommunity")}</p>
      <div className="buttons">
        <Button bigHorizontalPadding onClick={() => reset()}>
          {t("Submissions.submitNewIssues")}
        </Button>
        <Button bigHorizontalPadding styleType="outlined" onClick={() => window.open(SocialLinks.Discord)}>
          <DiscordIcon fill={Colors.turquoise} /> <span className="ml-3">{t("joinOnDiscord")}</span>
        </Button>
      </div>

      <SubmissionSuccessModal isShowing={isShowingSuccessModal} onHide={hideSuccessModal} />
    </StyledSubmissionProcessed>
  );
}
