import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { useUserSharesPerVault } from "./useUserSharesPerVault";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

interface useUserSharesAndBalancePerVaultReturn {
  userSharesAvailable: BigNumber | undefined;
  userBalanceAvailable: BigNumber | undefined;
}

/**
 * Returns the amount of shares the user has and the value of those shares (balance) on staking token.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from and the balance of those shares
 * @returns The user shares amount and the user balance
 */
export function useUserSharesAndBalancePerVault(
  vault: IVault,
  userSharesAvailableCache?: BigNumber
): useUserSharesAndBalancePerVaultReturn {
  const isTabFocused = useTabFocus();

  // If we are receiving userSharesAvailable from function, we dont need to call the contract
  let userSharesAvailable = useUserSharesPerVault(userSharesAvailableCache ? undefined : vault);
  userSharesAvailable = userSharesAvailableCache ?? userSharesAvailable;

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault.version === "v1" ? "poolInfo" : "previewRedeem";
  const args = vault.version === "v1" ? [vault.pid] : [userSharesAvailable];

  const { data: res, isError } = useContractRead({
    enabled: isTabFocused,
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: method,
    chainId: vault.chainId,
    scopeKey: "hats",
    watch: isTabFocused,
    args,
  });
  const data = res as any;

  let userBalanceAvailable: BigNumber | undefined = undefined;

  if (!isError && data) {
    if (vault.version === "v1") {
      const totalShares: BigNumber | undefined = data.totalUsersAmount;
      const totalBalance: BigNumber | undefined = data.balance;

      if (totalShares && totalBalance && userSharesAvailable) {
        if (!totalShares.eq(0)) {
          userBalanceAvailable = userSharesAvailable?.mul(totalBalance).div(totalShares);
        }
      }
    } else {
      userBalanceAvailable = data;
    }
  }

  return { userSharesAvailable, userBalanceAvailable };
}
