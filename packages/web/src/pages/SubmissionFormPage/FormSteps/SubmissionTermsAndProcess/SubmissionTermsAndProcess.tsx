import { IVulnerabilitySeverity } from "@hats-finance/shared";
import { Alert, Button, FormInput } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VaultRewardCard } from "./VaultRewardCard/VaultRewardCard";
import {
  getAlertTermsContent,
  getSubmissionAwardsContent,
  getSubmissionFixRemedyContent,
  getSubmissionTermsContent,
} from "./data";
import { StyledSubmissionTermsAndProcess, StyledTermsSection } from "./styles";

export function SubmissionTermsAndProcess() {
  const { t } = useTranslation();

  const { submissionData, setSubmissionData } = useContext(SubmissionFormContext);
  const [acceptedTermsOfUse, setAcceptedTermsOfUse] = useState(false);

  const { vaults } = useVaults();
  const vault = vaults?.find((vault) => vault.id === submissionData?.project?.projectId);
  const isAuditCompetition = vault?.description?.["project-metadata"].type === "audit";

  useEffect(() => {
    setAcceptedTermsOfUse(submissionData?.terms?.verified || false);
  }, [submissionData]);

  const handleTermsAccepted = () => {
    if (!acceptedTermsOfUse) return;

    setSubmissionData((prev) => {
      if (prev) return { ...prev, terms: { verified: true } };
    });
  };

  if (!vault) return <Alert type="error">{t("Submissions.firstYouNeedToSelectAProject")}</Alert>;

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
              <div>{t("level")}</div>
              <div>{t("prize")}</div>
              <div>{t("nft")}</div>
            </div>
            {vault.description?.severities.map((severity: IVulnerabilitySeverity, idx: number) => {
              return <VaultRewardCard key={idx} vault={vault} severity={severity} severityIndex={idx} />;
            })}
          </div>
        </div>
      </StyledTermsSection>

      {!isAuditCompetition && (
        <StyledTermsSection type="alert">
          <div className="section-content">{getAlertTermsContent(vault, t)}</div>
        </StyledTermsSection>
      )}

      <StyledTermsSection type="invisible">
        <div className="section-content">
          <p className="mb-5" dangerouslySetInnerHTML={{ __html: t("Submissions.pleaseBeforeMovingCheckTerms") }} />
          <FormInput
            name="termsOfUse"
            checked={acceptedTermsOfUse}
            onChange={(e) => setAcceptedTermsOfUse(e.target.checked)}
            label={t("Submissions.understandTermsOfUse")}
            type="checkbox"
          />
        </div>
      </StyledTermsSection>

      <div className="buttons mt-3">
        <Button disabled={!acceptedTermsOfUse} onClick={handleTermsAccepted} bigHorizontalPadding>
          {t("next")}
        </Button>
      </div>
    </StyledSubmissionTermsAndProcess>
  );
}
