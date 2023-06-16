import { ALL_CHAINS, IVault, IVaultRepoInformation, severitiesToContractsCoveredForm } from "@hats-finance/shared";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DocumentIcon from "@mui/icons-material/DescriptionOutlined";
import OpenIcon from "@mui/icons-material/LaunchOutlined";
import OverviewIcon from "@mui/icons-material/SelfImprovementOutlined";
import TerminalIcon from "@mui/icons-material/Terminal";
import ContractsIcon from "@mui/icons-material/ViewInAr";
import { Button, Pill, WithTooltip } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import { checkUrl } from "utils/yup.utils";
import { StyledContractsList, StyledInScopeSection } from "./styles";

type InScopeSectionProps = {
  vault: IVault;
};

export const InScopeSection = ({ vault }: InScopeSectionProps) => {
  const { t } = useTranslation();

  if (!vault.description) return null;

  const contractsCovered = severitiesToContractsCoveredForm(vault.description?.severities);
  const docsLink = vault.description.scope?.docsLink;

  const goToRepo = (repo: IVaultRepoInformation) => {
    if (repo.commitHash) {
      window.open(`${repo.url}/commit/${repo.commitHash}`, "_blank");
    } else {
      window.open(repo.url, "_blank");
    }
  };

  const getContractsCoveredList = () => {
    return (
      <>
        <div className="header-titles">
          {contractsCovered[0].name ? (
            <>
              <p>{t("name")}</p>
              <p>{t("addressOrLink")}</p>
            </>
          ) : (
            <>
              <p>{t("nameOrLink")}</p>
              <p>{t("loc")}</p>
              <p>{t("description")}</p>
              <p>{t("deployment")}</p>
            </>
          )}
        </div>
        {contractsCovered.map((contract, idx) => {
          const contractHref = contract.address.includes("http") ? contract.address : `//${contract.address}`;

          return (
            <div className="contract" key={idx}>
              {/* If the contract has contract.name is because is the old version */}
              {contract.name ? (
                <>
                  <div>{contract.name}</div>
                  {checkUrl(contract.address) ? (
                    <a href={contractHref} {...defaultAnchorProps}>
                      {contract.address}
                    </a>
                  ) : (
                    <div>{contract.address}</div>
                  )}
                </>
              ) : (
                <>
                  {checkUrl(contract.address) ? (
                    <a href={contractHref} {...defaultAnchorProps}>
                      {contract.address.split("/").slice(-2).join("/")}
                    </a>
                  ) : (
                    <div>{contract.address}</div>
                  )}
                  <div>200</div>
                  <div>{contract.description}</div>
                  <div className="deployments">
                    {contract.deploymentInfo ? (
                      contract.deploymentInfo.map((deployment, idx) => {
                        const deploymentChain = ALL_CHAINS[+deployment.chainId];
                        const blockExplorer = deploymentChain.blockExplorers?.default;
                        const deploymentUrl = blockExplorer?.url + `/address/${deployment.contractAddress}`;
                        const anchorTitle = t("goToText", { text: blockExplorer?.name });

                        return (
                          <WithTooltip text={anchorTitle} key={idx}>
                            <a title={anchorTitle} href={deploymentUrl} {...defaultAnchorProps} className="deployment">
                              <span className="chain">[{deploymentChain.name}]</span>
                              <span>{shortenIfAddress(deployment.contractAddress)}</span>
                              <OpenIcon className="icon" />
                            </a>
                          </WithTooltip>
                        );
                      })
                    ) : (
                      <>{t("noDeploymentsInfo")}</>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <StyledInScopeSection className="scope-section-container">
      {/* Overview */}
      {vault.description.scope?.description && (
        <>
          <h4 className="section-subtitle">
            <OverviewIcon className="icon" />
            <span>{t("overview")}</span>
          </h4>

          <div className="section-content">
            <p>{vault.description?.scope?.description}</p>
            <div className="code-languages">
              {vault.description.scope.codeLangs.map((codeLang) => (
                <Pill key={codeLang} isChecked text={codeLang} />
              ))}
            </div>
          </div>
          {vault.description.scope?.reposInformation.length && <div className="separator" />}
        </>
      )}

      {/* Repos information */}
      {vault.description.scope?.reposInformation.length && (
        <>
          <h4 className="section-subtitle">
            <TerminalIcon className="icon" />
            <span>{t("repositories")}</span>
          </h4>

          <div className="section-content repos">
            {vault.description.scope?.reposInformation.map((repo, idx) => (
              <div className="repo" key={idx}>
                <div className="info">
                  <p className="repo-name">{repo.url}</p>
                  {repo.commitHash && (
                    <p className="commit-hash">
                      {t("commitHash")}: {repo.commitHash}
                    </p>
                  )}
                </div>
                <Button size="medium" onClick={() => goToRepo(repo)}>
                  {repo.commitHash ? t("goToRepoAndCommit") : t("goToRepo")} <ArrowForwardIcon className="ml-3" />
                </Button>
              </div>
            ))}
          </div>
          {contractsCovered.length && <div className="separator" />}
        </>
      )}

      {/* Contracts covered */}
      {contractsCovered.length && (
        <>
          <h4 className="section-subtitle">
            <ContractsIcon className="icon" />
            <span>{t("contractsAssetsCovered")}</span>
          </h4>

          <StyledContractsList className="section-content" isOldVersion={!!contractsCovered[0].name}>
            {getContractsCoveredList()}
          </StyledContractsList>
          {docsLink && <div className="separator" />}
        </>
      )}

      {/* Documentation */}
      {docsLink && (
        <>
          <h4 className="section-subtitle">
            <DocumentIcon className="icon" />
            <span>{t("documentation")}</span>
          </h4>

          <div className="section-content">
            <a href={docsLink.includes("http") ? docsLink : `//${docsLink}`} {...defaultAnchorProps}>
              {docsLink}
            </a>
          </div>
        </>
      )}
    </StyledInScopeSection>
  );
};
