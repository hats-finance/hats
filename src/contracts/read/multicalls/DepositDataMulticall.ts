import { BigNumber } from "ethers";
import { IVault } from "./../../../types/types";
import { useTabFocus } from "hooks/useTabFocus";
import { useAccount, useContractReads } from "wagmi";
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
        PendingRewardContract.contractInfo(selectedVault, account),
        DepositTierContract.contractInfo(selectedVault, account),
        TotalSharesPerVaultContract.contractInfo(selectedVault),
      ],
    });
    const data = res as any;

    return !isError && data
      ? {
          tokenAllowance: data?.[0] as BigNumber,
          userSharesAvailable: selectedVault.version === "v1" ? (data?.[1]?.[0] as BigNumber) : (data?.[1] as BigNumber),
          pendingReward: data?.[2] as BigNumber,
          tierFromShares: data?.[3] as number,
          totalSharesAvailable: selectedVault.version === "v1" ? (data?.[4]?.[0] as BigNumber) : (data?.[4] as BigNumber),
        }
      : {};
  };
}
