import { IVault } from "@hats-finance/shared";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { Alert, Button, HatSpinner } from "components";
import useConfirm from "hooks/useConfirm";
import { useTranslation } from "react-i18next";
import { useSavedSubmissions, useVaultRepoName } from "../../hooks";
import PublicSubmissionCard from "./PublicSubmissionCard/PublicSubmissionCard";
import { StyledSubmissionsSection } from "./styles";

type VaultSubmissionsSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
};

export const VaultSubmissionsSection = ({ vault }: VaultSubmissionsSectionProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data: savedSubmissions, isLoading } = useSavedSubmissions(vault);
  const { data: repoName } = useVaultRepoName(vault);

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

  return (
    <StyledSubmissionsSection>
      <h2>
        {t("submissions")}

        {repoName && (
          <Button className="ml-3" styleType="text" textColor="secondary" onClick={goToGithubIssues}>
            {t("seeSubmissionsOnGithub")}
          </Button>
        )}
      </h2>

      {savedSubmissions?.length === 0 && (
        <Alert className="mt-5 mb-5" type="info">
          {t("thereIsNoPublicSubmission")}
        </Alert>
      )}

      {isLoading && <HatSpinner text={`${t("gettingSubmissions")}...`} />}

      {savedSubmissions && savedSubmissions?.length > 0 && (
        <div className="public-submissions">
          {savedSubmissions.map((submission) => (
            <PublicSubmissionCard key={submission._id} vault={vault} submission={submission} />
          ))}
        </div>
      )}
    </StyledSubmissionsSection>
  );
};
