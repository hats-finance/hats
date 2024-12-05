import { IPayoutGraph, IVault } from "@hats.finance/shared";
import ClockIcon from "@mui/icons-material/AccessTimeOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Alert, Button, HatSpinner } from "components";
import useConfirm from "hooks/useConfirm";
import { useTranslation } from "react-i18next";
import { useGHIssues, useGHPRs, useVaultRepoName } from "../../hooks";
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

  const { data: ghIssues, isLoading: isLoadingIssues } = useGHIssues(vault);
  const { data: ghPRs, isLoading: isLoadingPRs } = useGHPRs(vault);
  const { data: repoName } = useVaultRepoName(vault);

  console.log(ghPRs);

  const isPrivateAudit = vault?.description?.["project-metadata"].isPrivateAudit;
  const bonusPointsEnabled = vault.description?.["project-metadata"]?.bonusPointsEnabled;

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
    if (ghIssues?.length === 0) return null;

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
      {bonusPointsEnabled && getBonusPointsSection()}
      <h2>
        {t("submissions")}

        {repoName && (
          <Button className="ml-3" styleType="text" textColor="secondary" onClick={goToGithubIssues}>
            {t("seeSubmissionsOnGithub")}
          </Button>
        )}
      </h2>

      {!isPrivateAudit && ghIssues?.length === 0 && (
        <Alert className="mt-5 mb-5" type="info">
          {t("thereIsNoPublicSubmission")}
        </Alert>
      )}

      {!isPrivateAudit && isLoadingIssues && isLoadingPRs && <HatSpinner text={`${t("gettingSubmissions")}...`} />}

      {!isPrivateAudit && ghIssues && ghIssues?.length > 0 && (
        <div className="public-submissions">
          {ghIssues.map((submission) => (
            <PublicSubmissionCard
              key={submission.number}
              vault={vault}
              submission={submission}
              linkedPRs={ghPRs?.filter((pr) => pr.linkedIssueNumber === submission.number) ?? []}
            />
          ))}
        </div>
      )}
    </StyledSubmissionsSection>
  );
};
