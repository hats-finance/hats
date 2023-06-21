import { Loading } from "components";
import {
  ClaimRewardContract,
  CommitteeCheckInContract,
  DepositContract,
  TokenApproveAllowanceContract,
  WithdrawAndClaimContract,
  WithdrawRequestContract,
} from "contracts";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useWaitForTransaction } from "wagmi";
import { VaultDetailsContext } from "../../store";
import { HoldingsSection } from "./HoldingsSection/HoldingsSection";
import { VaultAssetsSection } from "./VaultAssetsSection/VaultAssetsSection";
import { IVaultDepositsSectionContext, VaultDepositsSectionContext } from "./store";
import { StyledDepositsSection } from "./styles";
import { useHasUserDepositedAmount } from "./useHasUserDepositedAmount";

export const VaultDepositsSection = () => {
  const { t } = useTranslation();
  const { vault } = useContext(VaultDetailsContext);

  const hasUserDeposited = useHasUserDepositedAmount([vault]);

  const withdrawRequestCall = WithdrawRequestContract.hook(vault);
  const waitingWithdrawRequestCall = useWaitForTransaction({
    hash: withdrawRequestCall.data?.hash as `0x${string}`,
  });
  const handleWithdrawRequest = useCallback(() => {
    withdrawRequestCall.send();
  }, [withdrawRequestCall]);

  const depositsContext: IVaultDepositsSectionContext = {
    handleWithdrawRequest,
  };

  return (
    <>
      <VaultDepositsSectionContext.Provider value={depositsContext}>
        <StyledDepositsSection>
          <div>
            <h2>{t("vaultAssets")}</h2>
            <VaultAssetsSection vault={vault} />
          </div>

          {hasUserDeposited && (
            <div>
              <h2>{t("yourHoldings")}</h2>
              <HoldingsSection vault={vault} />
            </div>
          )}
        </StyledDepositsSection>
      </VaultDepositsSectionContext.Provider>

      {withdrawRequestCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}

      {waitingWithdrawRequestCall.isLoading && <Loading fixed extraText={`${t("requestingWithdraw")}...`} />}
    </>
  );
};
