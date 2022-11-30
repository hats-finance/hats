import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

export const getUserSharesPerVaultContractInfo = (vault?: IVault, account?: string | undefined) => {
  const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
  const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault?.version === "v1" ? "userInfo" : "balanceOf";
  const args = vault?.version === "v1" ? [vault?.pid, account] : [account];

  return {
    address: vault ? contractAddress : undefined,
    abi: vaultAbi as any,
    functionName: method,
    chainId: vault?.chainId,
    args,
  };
};

/**
 * Returns the amount of shares the user has on the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from. If vault is undefined the call wont be executed.
 * @returns The user shares amount
 */
export function useUserSharesPerVault(vault?: IVault): BigNumber {
  const isTabFocused = useTabFocus();
  const { address: account } = useAccount();

  const { data: res, isError } = useContractRead({
    ...getUserSharesPerVaultContractInfo(vault, account),
    enabled: isTabFocused,
    scopeKey: "hats",
    watch: isTabFocused,
  });
  const data = res as any;

  let userSharesAmount: BigNumber = BigNumber.from(0);

  if (!isError && data) {
    if (vault?.version === "v1") {
      userSharesAmount = data.amount ?? BigNumber.from(0);
    } else if (vault?.version === "v2") {
      userSharesAmount = data ?? BigNumber.from(0);
    }
  }

  return userSharesAmount;
}
