import { useContractWrite, useNetwork } from "wagmi";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultV2_abi } from "@hats-finance/shared";

// TODO: Support v1 vaults
export class ExecutePayoutContract {
  /**
   * Returns a caller function to execute a payout on the registry
   *
   * @remarks
   * This method is supporting v2 vaults only.
   *
   * @param vault - The selected vault to execute the payout
   */
  static hook = (vault?: IVault) => {
    const { chain } = useNetwork();

    if (vault && vault.version !== "v2") throw new Error("ExecutePayout is only supported on v2 vaults");

    const contractAddress = vault?.id ?? "";
    const vaultAbi = HATSVaultV2_abi;
    const method = "submitClaim";

    const executePayout = useContractWrite({
      mode: "recklesslyUnprepared",
      address: vault ? contractAddress : undefined,
      abi: vaultAbi,
      functionName: method,
      // chainId: vault?.chainId,
    });

    return {
      ...executePayout,
      send: async (beneficiary: string, bountyPercentage: number, descriptionHash: string) => {
        if (!vault) return;
        await switchNetworkAndValidate(chain!.id, vault!.chainId as number);

        console.log([beneficiary as `0x${string}`, bountyPercentage, descriptionHash]);

        return executePayout.write!({
          recklesslySetUnpreparedArgs: [beneficiary as `0x${string}`, bountyPercentage, descriptionHash],
        });
      },
    };
  };
}
