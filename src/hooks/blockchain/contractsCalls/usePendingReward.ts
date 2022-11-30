import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { RewardController_abi } from "data/abis/RewardController_abi";

/**
 * Returns the amount of pending reward to claim for a giver user
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user pending reward from
 * @returns The pending reward amount
 */
export function usePendingReward(vault: IVault): BigNumber | undefined {
  const isTabFocused = useTabFocus();
  const { address: account } = useAccount();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.rewardController.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : RewardController_abi;
  const method = vault.version === "v1" ? "pendingReward" : "getPendingReward";
  const args = vault.version === "v1" ? [vault.pid, account] : [vault.id, account];

  const { data: res, isError } =
    useContractRead({
      enabled: isTabFocused,
      address: contractAddress,
      abi: vaultAbi as any,
      functionName: method,
      scopeKey: "hats",
      chainId: vault.chainId,
      watch: false,

      args,
    }) ?? {};
  const data = res as any;

  let pendingReward: BigNumber | undefined = undefined;

  if (!isError && data) {
    pendingReward = data ?? BigNumber.from(0);
  }

  return pendingReward;
}
