import { useContractWrite, useNetwork } from "wagmi";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

export class CommitteeCheckInContract {
  /**
   * Returns a caller function to checkin the committee to the vault
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to checkin the committee to
   */
  static hook = (vault?: IVault, extraDataV2?: { address: string; chainId: number }) => {
    const { chain } = useNetwork();

    const contractAddress = extraDataV2?.address ?? (vault?.version === "v1" ? vault?.master.address : vault?.id);
    const vaultAbi = vault?.version === "v2" || extraDataV2 ? HATSVaultV2_abi : HATSVaultV1_abi;

    const committeeCheckIn = useContractWrite({
      mode: "recklesslyUnprepared",
      address: contractAddress,
      abi: vaultAbi as any,
      functionName: "committeeCheckIn",
      // chainId: vault.chainId,
    });

    return {
      ...committeeCheckIn,
      send: async () => {
        await switchNetworkAndValidate(chain!.id, extraDataV2?.chainId ?? (vault?.chainId as number));

        if (vault?.version === "v2" || extraDataV2) {
          // [params]: none
          return committeeCheckIn.write!();
        } else {
          // [params]: pid
          return committeeCheckIn.write!({ recklesslySetUnpreparedArgs: [vault?.pid] });
        }
      },
    };
  };
}
