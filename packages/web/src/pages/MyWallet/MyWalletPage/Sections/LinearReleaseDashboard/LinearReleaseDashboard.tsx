import { Alert } from "components";
import { LinearReleaseAirdropControls } from "pages/Airdrops/AirdropsPage/components/AirdropCheckEligibility/AirdropCard/LinearReleaseAirdropControls/LinearReleaseAirdropControls";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useTokenLocksByEnv } from "./hooks";
import { StyledLinearReleaseDashboard } from "./styles";

export const LinearReleaseDashboard = () => {
  const { t } = useTranslation();

  const { address } = useAccount();
  const { data: tokenLocks } = useTokenLocksByEnv();
  tokenLocks?.sort((a, b) => (a.address > b.address ? 1 : -1));

  if (!address || !tokenLocks) {
    return <div className="mt-4">Loading...</div>;
  }

  return (
    <StyledLinearReleaseDashboard>
      {tokenLocks.length === 0 ? (
        <>
          <Alert className="mb-3" type="info">
            <span>{t("MyWallet.youHaveNoTokenLocks")}</span>
          </Alert>
        </>
      ) : (
        tokenLocks.map((tokenLock) => (
          <LinearReleaseAirdropControls
            standalone
            addressToCheck={address}
            tokenLockAddress={tokenLock.address}
            chainId={tokenLock.chainId}
          />
        ))
      )}
    </StyledLinearReleaseDashboard>
  );
};
