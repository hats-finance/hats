import { HATSVaultV1_abi, RewardController_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useAccount, useContractRead } from "wagmi";

export class PendingRewardContract {
  static contractInfo = (vault?: IVault, account?: string | undefined) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.rewardControllers[0]?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : RewardController_abi;
    const method = vault?.version === "v1" ? "pendingReward" : "getPendingReward";
    const args = vault?.version === "v1" ? [vault?.pid, account] : [vault?.id, account];

    return {
      address: (contractAddress as `0x${string}`) ?? "0x0000000000000000000000000000000000000000",
      abi: vaultAbi as any,
      functionName: method,
      chainId: vault?.chainId,
      args,
    };
  };

  static mapResponseToData = (res: any): BigNumber | undefined => {
    const data = res.data as any;

    let pendingReward: BigNumber | undefined = undefined;
    if (!res.isError && data) pendingReward = data ?? BigNumber.from(0);

    return pendingReward;
  };

  /**
   * Returns the amount of pending reward to claim for a giver user
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the user pending reward from
   * @returns The pending reward amount
   */
  static hook = (vault?: IVault): BigNumber | undefined => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const res =
      useContractRead({
        ...this.contractInfo(vault, account),
        enabled: isTabFocused,
        scopeKey: "hats",
        watch: false,
      }) ?? {};

    return this.mapResponseToData(res);
  };
}
