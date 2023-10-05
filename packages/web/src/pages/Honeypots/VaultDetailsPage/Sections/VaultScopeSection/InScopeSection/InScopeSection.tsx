import {
  ALL_CHAINS,
  IEditedContractCovered,
  IVault,
  IVaultRepoInformation,
  allowedElementsMarkdown,
  severitiesToContractsCoveredForm,
} from "@hats-finance/shared";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DocumentIcon from "@mui/icons-material/DescriptionOutlined";
import OpenIcon from "@mui/icons-material/LaunchOutlined";
import OverviewIcon from "@mui/icons-material/SelfImprovementOutlined";
import TerminalIcon from "@mui/icons-material/Terminal";
import ContractsIcon from "@mui/icons-material/ViewInAr";
import ContractsTwoIcon from "@mui/icons-material/ViewWeekOutlined";
import MDEditor from "@uiw/react-md-editor";
import { Alert, Button, CopyToClipboard, Loading, Pill, WithTooltip } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import useConfirm from "hooks/useConfirm";
import { useVaultRepoName } from "pages/Honeypots/VaultDetailsPage/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import { getContractsInfoFromRepos } from "utils/contractsCovered.utils";
import { checkUrl } from "utils/yup.utils";
import { StyledContractsList, StyledInScopeSection } from "./styles";

type InScopeSectionProps = {
  vault: IVault;
};

export const InScopeSection = ({ vault }: InScopeSectionProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data: repoName } = useVaultRepoName(vault);

  const [repoContractsList, setRepoContractsList] = useState<IEditedContractCovered[] | "loading">([]);

  useEffect(() => {
    const getRepoContractsList = async () => {
      setRepoContractsList("loading");
      const contractsList = await getContractsInfoFromRepos(vault.description?.scope?.reposInformation ?? []);
      setRepoContractsList(
        contractsList.map((contract) => ({
          name: "",
          link: "",
          address: contract.path,
          linesOfCode: contract.lines,
          severities: [],
          deploymentInfo: [],
        }))
      );
    };
    getRepoContractsList();
  }, [vault.description?.scope?.reposInformation]);

  if (!vault.description) return <Loading fixed extraText={`${t("loading")}...`} />;

  const isPrivateAudit = vault?.description?.["project-metadata"].isPrivateAudit;
  const contractsCovered = severitiesToContractsCoveredForm(vault.description?.severities);
  const docsLink = vault.description.scope?.docsLink;

  const goToGithubIssuesPrivateAudit = async () => {
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

  const goToRepo = (repo: IVaultRepoInformation) => {
    if (repo.commitHash) {
      window.open(`${repo.url}/commit/${repo.commitHash}`, "_blank");
    } else {
      window.open(repo.url, "_blank");
    }
  };

  const getContractsCoveredList = (contractsToUse: IEditedContractCovered[]) => {
    const showLinesOfCode = !contractsToUse[0].name && contractsToUse.some((contract) => contract.linesOfCode);
    const showDeploymentInfo =
      !contractsToUse[0].name &&
      contractsToUse.some((contract) => contract.deploymentInfo && contract.deploymentInfo.some((info) => info.contractAddress));

    return (
      <StyledContractsList className="section-content" extraColumns={Number(showLinesOfCode) + Number(showDeploymentInfo)}>
        <div className="header-titles">
          {contractsToUse[0].name ? (
            <>
              <p>{t("name")}</p>
              <p>{t("addressOrLink")}</p>
            </>
          ) : (
            <>
              <p>{t("nameOrLink")}</p>
              {showLinesOfCode && <p>{t("loc")}</p>}
              {showDeploymentInfo && <p>{t("deployment")}</p>}
            </>
          )}
        </div>
        {contractsToUse.map((contract, idx) => {
          const contractHref = contract.address.includes("http") ? contract.address : `//${contract.address}`;

          return (
            <div className="contract" key={idx}>
              {/* If the contract has contract.name is because is the old version */}
              {contract.name ? (
                <>
                  <div className="text-ellipsis">{contract.name}</div>
                  {checkUrl(contract.address) ? (
                    <a className="text-ellipsis" href={contractHref} {...defaultAnchorProps}>
                      {contract.address}
                    </a>
                  ) : (
                    <div className="text-ellipsis flex-horizontal">
                      <CopyToClipboard simple valueToCopy={contract.address} /> {contract.address}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {checkUrl(contract.address) ? (
                    <a className="text-ellipsis" title={contract.address} href={contractHref} {...defaultAnchorProps}>
                      .../{contract.address.split("/").slice(-1)}
                    </a>
                  ) : (
                    <div>{contract.address}</div>
                  )}
                  {showLinesOfCode && <div className="loc">{contract.linesOfCode ?? "-"}</div>}
                  {showDeploymentInfo && (
                    <div className="deployments">
                      {contract.deploymentInfo ? (
                        contract.deploymentInfo.map((deployment, idx) => {
                          if (!deployment.contractAddress || !deployment.chainId) return null;

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
                  )}
                </>
              )}
            </div>
          );
        })}
      </StyledContractsList>
    );
  };

  return (
    <StyledInScopeSection className="subsection-container">
      {/* Overview */}
      {vault.description.scope?.description && (
        <>
          <h4 className="section-subtitle">
            <OverviewIcon className="icon" />
            <span>{t("overview")}</span>
          </h4>

          <div className="section-content">
            <MDEditor.Markdown
              allowedElements={allowedElementsMarkdown}
              source={vault.description?.scope?.description}
              style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent", color: "var(--white)" }}
            />
            <div className="code-languages">
              {vault.description.scope.codeLangs.map((codeLang) => (
                <Pill key={codeLang} isChecked text={codeLang} />
              ))}
            </div>
          </div>
          {(vault.description.scope?.reposInformation.length > 0 ||
            (contractsCovered.length > 0 && vault.description.scope?.reposInformation)) && <div className="separator" />}
        </>
      )}

      {isPrivateAudit ? (
        <>
          <h4 className="section-subtitle">
            <TerminalIcon className="icon" />
            <span>{t("repositories")}</span>
          </h4>
          <div className="section-content repos">
            <div className="repo">
              <div className="info">
                <p className="repo-name">{`https://github.com/hats-finance/${repoName}`}</p>
              </div>
              <Button size="medium" onClick={goToGithubIssuesPrivateAudit}>
                {t("goToRepo")} <ArrowForwardIcon className="ml-3" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Repos information */}
          {vault.description.scope?.reposInformation && vault.description.scope?.reposInformation.length > 0 && (
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
              {(contractsCovered.length > 0 || repoContractsList.length > 0) && <div className="separator" />}
            </>
          )}
        </>
      )}

      {/* Contracts on repo */}
      {repoContractsList !== "loading" ? (
        repoContractsList.length > 0 && (
          <>
            <h4 className="section-subtitle">
              <ContractsTwoIcon className="icon" />
              <span>{t("contractsOnRepo")}</span>
            </h4>

            {getContractsCoveredList(repoContractsList)}
            {docsLink && <div className="separator" />}
          </>
        )
      ) : (
        <Alert type="info" className="mb-4">
          {t("loadingContractsOnRepo")}
        </Alert>
      )}

      {/* Contracts covered */}
      {contractsCovered.length > 0 && (
        <>
          <h4 className="section-subtitle">
            <ContractsIcon className="icon" />
            <span>{t("contractsAssetsCovered")}</span>
          </h4>

          {getContractsCoveredList(contractsCovered)}
          {docsLink && <div className="separator" />}
        </>
      )}

      {/* Documentation */}
      {docsLink && (
        <>
          <h4 className="section-subtitle mt-4">
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
