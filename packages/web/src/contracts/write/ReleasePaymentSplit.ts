import { HATPaymentSplitter_abi } from "@hats-finance/shared";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export class ReleasePaymentSplitContract {
  /**
   * Returns a caller function to release the reward from split contract
   *
   * @param vault - The selected vault to checkin the committee to
   */
  static hook = (vault: IVault, splitContractAddress: string | undefined) => {
    const { chain } = useNetwork();
    const { address } = useAccount();

    const committeeCheckIn = useContractWrite({
      mode: "recklesslyUnprepared",
      address: splitContractAddress as `0x${string}` | undefined,
      abi: HATPaymentSplitter_abi,
      functionName: "release",
      // chainId: vault.chainId,
    });

    return {
      ...committeeCheckIn,
      send: async () => {
        if (!vault.stakingToken || !address) return;

        await switchNetworkAndValidate(chain!.id, vault?.chainId);

        // [params]: token, account
        return committeeCheckIn.write!({
          recklesslySetUnpreparedArgs: [vault?.stakingToken as `0x${string}`, "0x9834b17a29652e317202109C2e624FE0A32A1383"],
        });
      },
    };
  };
}
