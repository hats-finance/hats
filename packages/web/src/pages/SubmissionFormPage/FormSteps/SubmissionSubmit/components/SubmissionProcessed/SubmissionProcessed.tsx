import DiscordIcon from "assets/icons/social/discord.icon";
import { Dot } from "components";
import { Colors, SocialLinks } from "constants/constants";
import useModal from "hooks/useModal";
import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { SubmissionOpStatus } from "pages/SubmissionFormPage/types";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SubmissionSuccessModal } from "../SubmissionSuccessModal/SubmissionSuccessModal";
import "./index.scss";

export default function SubmitProcessed() {
  const { t } = useTranslation();
  const { isShowing: isShowingSuccessModal, show: showSuccessModal, hide: hideSuccessModal } = useModal();
  const { submissionData, sendSubmissionToServer, reset } = useContext(SubmissionFormContext);
  const botStatus = submissionData?.submissionResult?.botStatus;
  const txStatus = submissionData?.submissionResult?.txStatus;

  useEffect(() => {
    if (botStatus === SubmissionOpStatus.Success) setTimeout(showSuccessModal, 500);
  }, [botStatus, showSuccessModal]);

  const getTxStatusInfo = () => {
    const dot = (
      <Dot
        color={
          txStatus === SubmissionOpStatus.Success
            ? Colors.turquoise
            : txStatus === SubmissionOpStatus.Fail
            ? Colors.red
            : Colors.yellow
        }
      />
    );
    let text = t("SubmitVulnerability.Submit.pending");
    if (txStatus === SubmissionOpStatus.Success) text = t("SubmitVulnerability.Submit.success");
    if (txStatus === SubmissionOpStatus.Fail) text = t("SubmitVulnerability.Submit.fail");

    return (
      <div className="transaction-status">
        <span className="transaction-status-label">{t("SubmitVulnerability.Submit.status")}:</span>
        {dot}
        {text}
      </div>
    );
  };

  const getBotStatusInfo = () => {
    const status = botStatus === SubmissionOpStatus.Success ? true : botStatus === SubmissionOpStatus.Fail ? false : null;
    const dot = <Dot color={status === true ? Colors.turquoise : status === false ? Colors.red : Colors.yellow} />;
    let text = t("SubmitVulnerability.Submit.pending");
    if (status === true) text = t("SubmitVulnerability.Submit.success");
    if (status === false) text = t("SubmitVulnerability.Submit.fail");

    return (
      <div className="transaction-status">
        <span className="transaction-status-label">{t("SubmitVulnerability.Submit.status")}:</span>
        {dot}
        {text}
      </div>
    );
  };

  return (
    <div className="submit-success-wrapper">
      <div>{t("SubmitVulnerability.Submit.submit-thanks")}</div>
      <div className="transaction-summary-wrapper">
        <div className="transaction-type">{t("SubmitVulnerability.Submit.on-chain-transaction")}</div>
        <div className="status-wrapper">{getTxStatusInfo()}</div>
      </div>

      <div className="transaction-summary-wrapper">
        <div className="transaction-type">{t("SubmitVulnerability.Submit.bot-confirmation")}</div>
        <div className="status-wrapper">
          {getBotStatusInfo()}

          {(botStatus === SubmissionOpStatus.Fail || botStatus === SubmissionOpStatus.Pending) && (
            <button disabled={botStatus === SubmissionOpStatus.Pending} onClick={() => sendSubmissionToServer(submissionData)}>
              {t("SubmitVulnerability.Submit.bot-resend")}
            </button>
          )}
        </div>
      </div>

      <div className="response-notice">{t("SubmitVulnerability.Submit.response-notice")}</div>

      {botStatus === SubmissionOpStatus.Success && (
        <div className="submit-complete-actions-wrapper">
          <span>{t("SubmitVulnerability.Submit.submit-complete-text")}</span>
          <div className="buttons-container">
            <button onClick={() => reset()}>SUBMIT NEW VULNERABILITY</button>
            <button className="discord-btn" onClick={() => window.open(SocialLinks.Discord)}>
              <span>JOIN US ON DISCORD</span>
              <DiscordIcon fill={Colors.darkBlue} />
            </button>
          </div>
        </div>
      )}

      <SubmissionSuccessModal isShowing={isShowingSuccessModal} onHide={hideSuccessModal} />
    </div>
  );
}