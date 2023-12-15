import { HATSVaultV1_abi, HATSVaultV2_abi } from "@hats.finance/shared";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useContractWrite, useNetwork } from "wagmi";

export class WithdrawRequestContract {
  /**
   * Returns a caller function to request a withdraw from the vault.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to request a withdraw from
   */
  static hook = (vault: IVault) => {
    const { chain } = useNetwork();

    const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
    const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

    const withdrawRequest = useContractWrite({
      mode: "recklesslyUnprepared",
      address: contractAddress as `0x${string}`,
      abi: vaultAbi as any,
      functionName: "withdrawRequest",
      // chainId: vault.chainId,
    });

    return {
      ...withdrawRequest,
      send: async () => {
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);

        if (vault?.version === "v2") {
          // [params]: none
          return withdrawRequest.write!();
        } else {
          // [params]: pid
          return withdrawRequest.write!({ recklesslySetUnpreparedArgs: [vault.pid] });
        }
      },
    };
  };
}
