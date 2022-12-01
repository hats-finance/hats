import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

export const getWithdrawRequestInfoContractInfo = (vault?: IVault, account?: string | undefined) => {
  const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
  const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault?.version === "v1" ? "withdrawRequests" : "withdrawEnableStartTime";
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
 * Returns the starting time in seconds when the user can withdraw from the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user withdraw start time from
 * @returns The user withdraw start time
 */
export function useWithdrawRequestInfo(vault: IVault): BigNumber | undefined {
  const isTabFocused = useTabFocus();
  const { address: account } = useAccount();

  const { data: res, isError } = useContractRead({
    ...getWithdrawRequestInfoContractInfo(vault, account),
    enabled: isTabFocused && !!account,
    scopeKey: "hats",
    watch: isTabFocused,
  });
  const data = res as any;

  let startTimeNumber: BigNumber | undefined = undefined;

  if (!isError && data) {
    startTimeNumber = data ?? undefined;
  }

  return startTimeNumber && !startTimeNumber.eq(0) ? startTimeNumber : undefined;
}
