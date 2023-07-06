import { Alert, Button, HatSpinner, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useVaultSubmissionsBySiweUser } from "../submissionsService.hooks";
import { SubmissionCard } from "./SubmissionCard";
import { StyledSubmissionsListPage } from "./styles";

export const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { keystore, initKeystore } = useKeystore();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const { data: committeeSubmissions, isLoading, isFetching } = useVaultSubmissionsBySiweUser();
  if (committeeSubmissions) console.log(committeeSubmissions);

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  useEffect(() => {
    if (!keystore) setTimeout(() => initKeystore(), 200);
  }, [keystore, initKeystore]);

  return (
    <StyledSubmissionsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>
            {t("committeeTools")}/<span className="bold">{t("submissions")}</span>
          </p>
        </div>
      </div>

      {!address || !isAuthenticated ? (
        <>
          {!address ? (
            <>
              <Alert className="mb-4" type="error">
                {t("pleaseConnectYourCommitteeWallet")}
              </Alert>
              <WalletButton expanded />
            </>
          ) : (
            <>
              <Alert className="mb-4" type="error">
                {t("youNeedToBeSignedInSiwe")}
              </Alert>
              <Button onClick={() => tryAuthentication()}>{t("signInWithEthereum")}</Button>
            </>
          )}
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
              {isLoading || isFetching ? (
                <HatSpinner text={`${t("loadingSubmissions")}...`} />
              ) : (
                <div className="submissions-list">
                  {committeeSubmissions?.map((submission, idx) => (
                    <SubmissionCard key={idx} submission={submission} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </StyledSubmissionsListPage>
  );
};
