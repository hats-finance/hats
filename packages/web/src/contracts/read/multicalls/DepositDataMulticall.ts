import { useTabFocus } from "hooks/useTabFocus";
import { useAccount, useContractReads } from "wagmi";
import { IVault } from "types";
import { TokenAllowanceContract } from "../TokenAllowance";
import { PendingRewardContract } from "../PendingReward";
import { UserSharesPerVaultContract } from "../UserSharesPerVault";
import { DepositTierContract } from "../DepositTier";
import { TotalSharesPerVaultContract } from "../TotalSharesPerVault";

/**
 * This is a multicall with [tokenAllowance(1.), userShares(3.), pendingReward(5.)]. Used mainly on Deposit/Withdraw page.
 */
export class DepositWithdrawDataMulticall {
  static hook = (selectedVault: IVault) => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const contractAddress = selectedVault.version === "v1" ? selectedVault.master.address : selectedVault.id;
    const vaultToken = selectedVault.stakingToken;

    const { data: res, isError } = useContractReads({
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
      contracts: [
        TokenAllowanceContract.contractInfo(vaultToken, account, contractAddress, selectedVault.chainId),
        UserSharesPerVaultContract.contractInfo(selectedVault, account),
        TotalSharesPerVaultContract.contractInfo(selectedVault),
        PendingRewardContract.contractInfo(selectedVault, account),
        DepositTierContract.contractInfo(selectedVault, account),
      ],
    });
    const data = res as any;

    return !isError && data
      ? {
          tokenAllowance: TokenAllowanceContract.mapResponseToData({ data: data?.[0] }),
          userSharesAvailable: UserSharesPerVaultContract.mapResponseToData({ data: data?.[1] }, selectedVault),
          totalSharesAvailable: TotalSharesPerVaultContract.mapResponseToData({ data: data?.[2] }, selectedVault),
          pendingReward: PendingRewardContract.mapResponseToData({ data: data?.[3] }),
          tierFromShares: DepositTierContract.mapResponseToData({ data: data?.[4] }),
        }
      : {};
  };
}
