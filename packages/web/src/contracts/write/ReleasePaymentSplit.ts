import { HATPaymentSplitter_abi } from "@hats-finance/shared";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export class ReleasePaymentSplitContract {
  /**
   * Returns a caller function to release the reward from split contract
   *
   * @param vault - The selected vault to release the payout from
   */
  static hook = (vault: IVault, splitContractAddress: string | undefined) => {
    const { chain } = useNetwork();
    const { address } = useAccount();

    const payoutRelease = useContractWrite({
      mode: "recklesslyUnprepared",
      address: splitContractAddress as `0x${string}` | undefined,
      abi: HATPaymentSplitter_abi,
      functionName: "release",
      // chainId: vault.chainId,
    });

    return {
      ...payoutRelease,
      send: async () => {
        if (!vault.stakingToken || !address) return;

        await switchNetworkAndValidate(chain!.id, vault?.chainId);

        // [params]: token, account
        return payoutRelease.write!({ recklesslySetUnpreparedArgs: [vault?.stakingToken as `0x${string}`, address] });
      },
    };
  };
}
