import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useAccount, useContractReads } from "wagmi";
import { DepositTierContract } from "../DepositTier";
import { TokenAllowanceContract } from "../TokenAllowance";
import { TotalSharesPerVaultContract } from "../TotalSharesPerVault";
import { UserSharesPerVaultContract } from "../UserSharesPerVault";

/**
 * This is a multicall with [tokenAllowance(1.), userShares(3.), pendingReward(5.)]. Used mainly on Deposit/Withdraw page.
 */
export class DepositWithdrawDataMulticall {
  static hook = (selectedVault: IVault) => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const contractAddress = selectedVault.version === "v1" ? selectedVault.master.address : selectedVault.id;
    const vaultToken = selectedVault.stakingToken as `0x${string}`;

    // Build contracts array, filtering out undefined values
    const depositTierContract = DepositTierContract.contractInfo(selectedVault, account);
    const contracts = [
      TokenAllowanceContract.contractInfo(vaultToken, account, contractAddress, selectedVault.chainId),
      UserSharesPerVaultContract.contractInfo(selectedVault, account),
      TotalSharesPerVaultContract.contractInfo(selectedVault),
      depositTierContract,
    ].filter((contract) => contract !== undefined);

    const { data: res, isError } = useContractReads({
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
      contracts,
    });
    const data = res as any;

    // Determine the index of tierFromShares in the response
    // It's always at index 3 if depositTierContract exists, otherwise undefined
    const tierFromSharesIndex = depositTierContract ? 3 : undefined;

    return !isError && data
      ? {
          tokenAllowance: TokenAllowanceContract.mapResponseToData({ data: data?.[0] }),
          userSharesAvailable: UserSharesPerVaultContract.mapResponseToData({ data: data?.[1] }, selectedVault),
          totalSharesAvailable: TotalSharesPerVaultContract.mapResponseToData({ data: data?.[2] }, selectedVault),
          tierFromShares: tierFromSharesIndex !== undefined ? DepositTierContract.mapResponseToData({ data: data?.[tierFromSharesIndex] }) : undefined,
        }
      : {};
  };
}
