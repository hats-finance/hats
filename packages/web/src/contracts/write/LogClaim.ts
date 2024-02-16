import { HATSVaultV1_abi, HATSVaultsRegistry_abi } from "@hats.finance/shared";
import { IVault } from "types";
import { IS_PROD } from "settings";
import * as wagmiChains from "@wagmi/chains";

import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useContractWrite, useNetwork } from "wagmi";

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
    const DEFAULT_NETWORK_TO_USE = IS_PROD ? wagmiChains.arbitrum.id as number : wagmiChains.sepolia.id as number;
    let useChaniId = DEFAULT_NETWORK_TO_USE;
    vault!.chainId != wagmiChains.mainnet.id ? useChaniId = vault!.chainId:null;
    const { chain } = useNetwork();
    const contractAddress = vault?.master.address ?? "";
    const registryAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultsRegistry_abi;
    const method = vault?.version === "v1" ? "claim" : "logClaim";

    const claim = useContractWrite({
      mode: "recklesslyUnprepared",
      address: vault ? (contractAddress as `0x${string}`) : undefined,
      abi: registryAbi as any,
      functionName: method,
      // chainId: vault?.chainId,
    });

    return {
      ...claim,
      send: async (data: string) => {
        if (!vault) return;
        await switchNetworkAndValidate(chain!.id, useChaniId);

        return claim.write!({ recklesslySetUnpreparedArgs: [data] });
      },
    };
  };
}
