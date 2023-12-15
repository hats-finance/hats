import { HATSVaultV2_abi, IEditedVaultParameters } from "@hats.finance/shared";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useContractWrite, useNetwork } from "wagmi";

export class VaultBountySplitEditionContract {
  /**
   * Returns a caller function to edit bounty split.
   *
   * @remarks
   * This method is only for v2 vaults.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (vaultData: { address: string; chainId: number }) => {
    const { chain } = useNetwork();

    const contractAddress = vaultData?.address;
    const vaultAbi = HATSVaultV2_abi;

    const editBountySplit = useContractWrite({
      mode: "recklesslyUnprepared",
      address: contractAddress as `0x${string}`,
      abi: vaultAbi,
      functionName: "setBountySplit",
      // chainId: vault.chainId,
    });

    return {
      ...editBountySplit,
      send: async (params: IEditedVaultParameters) => {
        await switchNetworkAndValidate(chain!.id, vaultData.chainId);

        return editBountySplit.write!({
          recklesslySetUnpreparedArgs: [
            {
              committee: params.committeePercentage * 100,
              hacker: params.immediatePercentage * 100,
              hackerVested: params.vestedPercentage * 100,
            },
          ],
        });
      },
    };
  };
}
