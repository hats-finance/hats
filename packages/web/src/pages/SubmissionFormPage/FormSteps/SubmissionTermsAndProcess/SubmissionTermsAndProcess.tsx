import { IVulnerabilitySeverity } from "@hats-finance/shared";
import { TERMS_OF_USE } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useVaults } from "hooks/vaults/useVaults";
import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VaultRewardCard } from "./VaultRewardCard/VaultRewardCard";
import { getSubmissionAwardsContent, getSubmissionFixRemedyContent, getSubmissionTermsContent } from "./data";
import { StyledSubmissionTermsAndProcess, StyledTermsSection } from "./styles";

export function SubmissionTermsAndProcess() {
  const { t } = useTranslation();

  const { submissionData, setSubmissionData } = useContext(SubmissionFormContext);
  const [acceptedTermsOfUse, setAcceptedTermsOfUse] = useState(false);

  const projectId = submissionData?.project?.projectId;
  const { vaults } = useVaults();
  const vault = vaults?.find((vault) => vault.id === projectId);
  const description = vault && vault.description;

  useEffect(() => {
    setAcceptedTermsOfUse(submissionData?.terms?.verified || false);
  }, [submissionData]);

  const handleTermsAccepted = () => {
    setSubmissionData((prev) => {
      if (prev) return { ...prev, terms: { verified: true } };
    });
  };

  if (!vault) return null;

  return (
    <StyledSubmissionTermsAndProcess>
      <p>{t("Submissions.termsDescription")}</p>

      <StyledTermsSection type="submission">
        <div className="section-title">1 {t("Submissions.submission")}</div>
        <div className="section-content">{getSubmissionTermsContent(vault, t)}</div>
      </StyledTermsSection>

      <StyledTermsSection type="fix">
        <div className="section-title">2 {t("Submissions.fixRemedy")}</div>
        <div className="section-content">{getSubmissionFixRemedyContent(vault, t)}</div>
      </StyledTermsSection>

      <StyledTermsSection type="rewards">
        <div className="section-title">3 {t("Submissions.rewards")}</div>
        <div className="section-content">
          <div>{getSubmissionAwardsContent(vault, t)}</div>
          <div className="rewards-list">
            <div className="titles">
              <div>Level</div>
              <div>Prize</div>
              <div>NFT</div>
            </div>
            {description?.severities.map((severity: IVulnerabilitySeverity, idx: number) => {
              return <VaultRewardCard key={idx} vault={vault} severity={severity} severityIndex={idx} />;
            })}
          </div>
        </div>
      </StyledTermsSection>

      {/* <div className="section-title fix">2 {t("SubmitVulnerability.TermsAndProcess.fix-sub-title")}</div>
      <div className="section-content fix">
        {t("SubmitVulnerability.TermsAndProcess.fix")}
        <div className="icon-text-wrapper">
          <img src={QuestionIcon} alt="question icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-question")}
        </div>

        <div className="icon-text-wrapper">
          <img src={ErrosIcon} alt="error icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-error")}
        </div>

        {t("SubmitVulnerability.TermsAndProcess.fix-text-1")}

        <div className="icon-text-wrapper">
          <img src={TimelineIcon} alt="timeline icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-timeline")}
        </div>

        <div className="icon-text-wrapper">
          <img src={BugIcon} alt="bugs icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-bugs")}
        </div>

        <div className="icon-text-wrapper">
          <img src={RewardIcon} alt="rewards icon" />
          {t("SubmitVulnerability.TermsAndProcess.fix-rewards")}
        </div>
      </div> */}

      {/* <div className="section-title awards">3 {t("SubmitVulnerability.TermsAndProcess.awards-sub-title")}</div>
      <div className="section-content awards">
        {t("SubmitVulnerability.TermsAndProcess.awards-text-1")}
        {submissionData?.project?.verified ? (
          <table>
            <tbody>
              <tr>
                <th>Level</th>
                <th>Prize</th>
                <th>NFT</th>
              </tr>
              {awards}
            </tbody>
          </table>
        ) : (
          "Please choose project to view prizes"
        )}
        {t("SubmitVulnerability.TermsAndProcess.awards-text-2")}
      </div> */}

      {/* <div className="warning-notice">{t("SubmitVulnerability.TermsAndProcess.warning-notice")}</div>

      <div className="accept-terms-wrapper">
        <div className="checkbox-container">
          <input type="checkbox" checked={acceptedTermsOfUse} onChange={() => setAcceptedTermsOfUse(!acceptedTermsOfUse)} />
          <label>
            I UNDERSTAND AND AGREE TO THE{" "}
            <u>
              <a {...defaultAnchorProps} href={TERMS_OF_USE}>
                TERMS OF USE
              </a>
            </u>
          </label>
        </div>
        <button disabled={!acceptedTermsOfUse} onClick={handleTermsAccepted}>
          NEXT
        </button>
      </div> */}
    </StyledSubmissionTermsAndProcess>
  );
}
