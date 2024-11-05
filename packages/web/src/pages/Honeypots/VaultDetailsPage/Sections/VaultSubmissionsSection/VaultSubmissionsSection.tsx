import { IPayoutGraph, IVault } from "@hats.finance/shared";
import ClockIcon from "@mui/icons-material/AccessTimeOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Alert, Button, HatSpinner } from "components";
import useConfirm from "hooks/useConfirm";
import { useTranslation } from "react-i18next";
import { useSavedSubmissions, useVaultRepoName } from "../../hooks";
import PublicSubmissionCard from "./PublicSubmissionCard/PublicSubmissionCard";
import { StyledSubmissionsSection } from "./styles";

type VaultSubmissionsSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
  auditPayout?: IPayoutGraph | undefined;
};

export const VaultSubmissionsSection = ({ vault }: VaultSubmissionsSectionProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data: savedSubmissions, isLoading } = useSavedSubmissions(vault);
  const { data: repoName } = useVaultRepoName(vault);
  const isPrivateAudit = vault?.description?.["project-metadata"].isPrivateAudit;

  const goToGithubIssues = async () => {
    if (!repoName) return;

    const githubLink = `https://github.com/hats-finance/${repoName}/issues`;

    const wantToGo = await confirm({
      title: t("openGithub"),
      titleIcon: <OpenIcon className="mr-2" fontSize="large" />,
      description: t("doYouWantToSeeSubmissionsOnGithub"),
      cancelText: t("no"),
      confirmText: t("yesGo"),
    });

    if (!wantToGo) return;
    window.open(githubLink, "_blank");
  };

  const getBonusPointsSection = () => {
    if (isPrivateAudit) return null;
    if (savedSubmissions?.length === 0) return null;

    return (
      <div className="bonus-points-section">
        <div className="title-container">
          <div className="icon">
            <VerifiedIcon />
          </div>
          <p>{t("bonusPointsTitle")}</p>
        </div>

        <div className="content" dangerouslySetInnerHTML={{ __html: t("bonusPointsDescription") }} />
        <div className="remember">
          <ClockIcon />
          <p>{t("bonusPointsReminder")}</p>
        </div>
      </div>
    );
  };

  return (
    <StyledSubmissionsSection>
      {isPrivateAudit && (
        <Alert className="mt-5 mb-5" type="info">
          {t("privateAuditSubmissionsOnlyOnGithub")}
        </Alert>
      )}
      {getBonusPointsSection()}
      <h2>
        {t("submissions")}

        {repoName && (
          <Button className="ml-3" styleType="text" textColor="secondary" onClick={goToGithubIssues}>
            {t("seeSubmissionsOnGithub")}
          </Button>
        )}
      </h2>

      {!isPrivateAudit && savedSubmissions?.length === 0 && (
        <Alert className="mt-5 mb-5" type="info">
          {t("thereIsNoPublicSubmission")}
        </Alert>
      )}

      {!isPrivateAudit && isLoading && <HatSpinner text={`${t("gettingSubmissions")}...`} />}

      {!isPrivateAudit && savedSubmissions && savedSubmissions?.length > 0 && (
        <div className="public-submissions">
          {savedSubmissions.map((submission) => (
            <PublicSubmissionCard key={submission.number} vault={vault} submission={submission} />
          ))}
        </div>
      )}
    </StyledSubmissionsSection>
  );
};
