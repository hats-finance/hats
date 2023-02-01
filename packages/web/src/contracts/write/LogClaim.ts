import { useContractWrite, useNetwork } from "wagmi";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultsRegistry_abi } from "data/abis/HATSVaultsRegistry_abi";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";

export class LogClaimContract {
  /**
   * Returns a caller function to log a claim on the registry
   *
   * @remarks
   * This method is supporting v1 and v2 vaults. In both version the logClaim function is
   * inside the registry
   *
   * @param vault - The selected vault to send the claim
   */
  static hook = (vault?: IVault) => {
    const { chain } = useNetwork();

    const contractAddress = vault?.master.address ?? "";
    const registryAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultsRegistry_abi;
    const method = vault?.version === "v1" ? "claim" : "logClaim";

    const claim = useContractWrite({
      mode: "recklesslyUnprepared",
      address: vault ? contractAddress : undefined,
      abi: registryAbi as any,
      functionName: method,
      // chainId: vault?.chainId,
    });

    return {
      ...claim,
      send: async (data: string) => {
        if (!vault) return;
        await switchNetworkAndValidate(chain!.id, vault!.chainId as number);

        return claim.write!({ recklesslySetUnpreparedArgs: [data] });
      },
    };
  };
}
