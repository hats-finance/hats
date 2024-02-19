import { RewardController_abi } from "@hats.finance/shared";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export class ClaimRewardContract {
  /**
   * Returns a caller function to claim the user's rewards from the vault.
   *
   * @remarks
   * For v2 vaults, we are using the rewardController.
   *
   * @param rewardControllerAddress - The selected vault reward controller address
   */
  static hook = (rewardControllerAddress: string, vault: IVault) => {
    const { address: account } = useAccount();
    const { chain } = useNetwork();

    const claimReward = useContractWrite({
      mode: "recklesslyUnprepared",
      address: rewardControllerAddress as `0x${string}`,
      abi: RewardController_abi as any,
      functionName: "claimReward",
      // chainId: vault.chainId,
    });

    return {
      ...claimReward,
      send: async () => {
        console.log([vault.id, account]);
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);
        return claimReward.write!({ recklesslySetUnpreparedArgs: [vault.id, account] });
      },
    };
  };
}
