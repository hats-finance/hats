import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

/**
 * Returns the amount of shares the user has on the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from
 * @returns The user shares amount
 */
export function useUserSharesPerVault(vault: IVault): BigNumber {
  const isTabFocused = useTabFocus();
  const { address: account } = useAccount();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault.version === "v1" ? "userInfo" : "balanceOf";
  const args = vault.version === "v1" ? [vault.pid, account] : [account];

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

  let userSharesAmount: BigNumber = BigNumber.from(0);

  if (!isError && data) {
    if (vault.version === "v1") {
      userSharesAmount = data.amount ?? BigNumber.from(0);
    } else {
      userSharesAmount = data ?? BigNumber.from(0);
    }
  }

  return userSharesAmount;
}
