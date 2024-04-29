import { HATSVaultV1_abi, HATSVaultV2_abi, HATSVaultV3ClaimsManager_abi } from "@hats.finance/shared";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useContractWrite, useNetwork } from "wagmi";

export class CommitteeCheckInContract {
  /**
   * Returns a caller function to checkin the committee to the vault
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to checkin the committee to
   */
  static hook = (vault?: IVault) => {
    const { chain } = useNetwork();

    const contractAddress =
      vault?.version === "v1" ? vault?.master.address : vault?.version === "v2" ? vault?.id : vault?.claimsManager;
    const vaultAbi =
      vault?.version === "v1" ? HATSVaultV1_abi : vault?.version === "v2" ? HATSVaultV2_abi : HATSVaultV3ClaimsManager_abi;

    const committeeCheckIn = useContractWrite({
      mode: "recklesslyUnprepared",
      address: contractAddress as `0x${string}`,
      abi: vaultAbi as any,
      functionName: "committeeCheckIn",
      // chainId: vault.chainId,
    });

    return {
      ...committeeCheckIn,
      send: async () => {
        await switchNetworkAndValidate(chain!.id, vault?.chainId as number);

        if (vault?.version === "v3") {
          // [params]: none
          return committeeCheckIn.write!();
        } else if (vault?.version === "v2") {
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
