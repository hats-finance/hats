import { GithubIssue, allowedElementsMarkdown } from "@hats.finance/shared";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import LinkIcon from "@mui/icons-material/InsertLinkOutlined";
import MDEditor from "@uiw/react-md-editor";
import { Alert, Button, HatSpinner, Loading, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import { IPFS_PREFIX } from "constants/constants";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { RoutePaths } from "navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { appChains } from "settings";
import { useAccount } from "wagmi";
import { SubmissionCard } from "../SubmissionsListPage/SubmissionCard";
import { getGhIssueFromSubmission, getGithubIssuesFromVault } from "../submissionsService.api";
import { useVaultSubmissionsByKeystore } from "../submissionsService.hooks";
import { StyledSubmissionDetailsPage } from "./styles";

export const SubmissionDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { keystore, initKeystore } = useKeystore();
  const { allVaults, vaultsReadyAllChains } = useVaults();

  const { subId } = useParams();
  const { data: committeeSubmissions, isLoading } = useVaultSubmissionsByKeystore();
  const submission = committeeSubmissions?.find((sub) => sub.subId === subId);

  const [vaultGithubIssues, setVaultGithubIssues] = useState<GithubIssue[] | undefined>(undefined);
  const [isLoadingGH, setIsLoadingGH] = useState<boolean>(false);

  useEffect(() => {
    if (!keystore) setTimeout(() => initKeystore(), 600);
  }, [keystore, initKeystore]);

  // Get information from github
  useEffect(() => {
    if (!submission) return;

    const vault = allVaults?.find((vault) => vault.id.toLowerCase() === submission.linkedVault?.id.toLowerCase());
    if (!vault) return;
    if (vaultGithubIssues !== undefined || isLoadingGH) return;

    const loadGhIssues = async () => {
      setIsLoadingGH(true);
      const ghIssues = await getGithubIssuesFromVault(vault);
      setVaultGithubIssues(ghIssues);
      setIsLoadingGH(false);
    };
    loadGhIssues();
  }, [allVaults, vaultGithubIssues, submission, isLoadingGH]);

  const openSubmissionData = () => {
    window.open(`${IPFS_PREFIX}/${submission?.submissionHash}`, "_blank");
  };

  const openTxOnChain = () => {
    const chainId = submission?.chainId;
    if (!chainId) return;

    const blockExplorer = appChains[chainId].chain.blockExplorers?.default.url;
    window.open(`${blockExplorer}/tx/${submission.txid}`, "_blank");
  };

  return (
    <StyledSubmissionDetailsPage className="content-wrapper-md">
      {!address ? (
        <>
          <Alert className="mb-4" type="error">
            {t("pleaseConnectYourCommitteeWallet")}
          </Alert>
          <WalletButton expanded />
        </>
      ) : (
        <>
          {!keystore ? (
            <>
              <Alert className="mb-4" type="error">
                {t("youNeedToOpenYourPGPTool")}
              </Alert>
              <Button onClick={() => initKeystore()}>{t("openPGPTool")}</Button>
            </>
          ) : (
            <>
              {isLoading ? (
                <HatSpinner text={`${t("loadingSubmission")}...`} />
              ) : (
                <>
                  {!submission ? (
                    <>
                      <Alert className="mb-4" type="error">
                        {t("submissionNotFound")}
                      </Alert>
                      <Button onClick={() => initKeystore()}>{t("openPGPTool")}</Button>
                    </>
                  ) : (
                    <>
                      <div className="title-container">
                        <div className="title" onClick={() => navigate(`${RoutePaths.committee_tools}/submissions`)}>
                          <ArrowBackIcon />
                          <p>
                            {t("committeeTools")}/<span className="bold">{t("submission")}</span>
                          </p>
                        </div>
                      </div>
                      <SubmissionCard
                        submission={submission}
                        noActions
                        ghIssue={getGhIssueFromSubmission(submission, vaultGithubIssues)}
                      />

                      <MDEditor.Markdown
                        allowedElements={allowedElementsMarkdown}
                        className="submission-content"
                        source={submission?.submissionDataStructure?.content}
                      />

                      <div className="buttons">
                        {submission.txid && (
                          <Button onClick={openTxOnChain}>
                            <LinkIcon className="mr-2" />
                            {t("openTxOnChain")}
                          </Button>
                        )}
                        <Button styleType="outlined" onClick={openSubmissionData}>
                          {t("seeSubmissionData")}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {!vaultsReadyAllChains && <Loading fixed extraText={`${t("loadingVaults")}...`} />}
      {isLoadingGH && <Loading fixed extraText={`${t("loadingGithubIssues")}...`} />}
    </StyledSubmissionDetailsPage>
  );
};
