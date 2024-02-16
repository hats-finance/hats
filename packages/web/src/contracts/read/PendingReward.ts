import { HATSVaultV1_abi, IVaultV2, RewardController_abi } from "@hats.finance/shared";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { Amount } from "utils/amounts.utils";
import { useAccount, useContractReads } from "wagmi";

export class PendingRewardContract {
  static contractInfo = (vault?: IVault, account?: string | undefined, rewardControllerIndex = 0) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.rewardControllers[rewardControllerIndex]?.id;
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

  static mapResponseToData = (res: any, vault: IVault): Amount[] | undefined => {
    if (vault.version === "v1") return undefined;

    const data = res.data as any[];
    if (res.isError || !data) return undefined;
    return data.map((d, index) => {
      const rewardController = (vault as IVaultV2).rewardControllers[index];
      return (
        new Amount(d, rewardController?.rewardTokenDecimals ?? "18", rewardController?.rewardTokenSymbol) ??
        new Amount(undefined, "18")
      );
    });
  };

  /**
   * Returns the amount of pending reward to claim for a given user
   *
   * @remarks
   * This method is supporting only v2 vaults.
   *
   * @param vault - The selected vault to get the user pending reward from
   * @returns The pending reward amount
   */
  static hook = (vault?: IVault): Amount[] | undefined => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const res =
      useContractReads({
        contracts: vault?.version === "v1" ? [] : vault?.rewardControllers.map((_, i) => this.contractInfo(vault, account, i)),
        enabled: isTabFocused,
        scopeKey: "hats",
        watch: false,
      }) ?? {};

    return this.mapResponseToData(res, vault as IVaultV2);
  };
}
