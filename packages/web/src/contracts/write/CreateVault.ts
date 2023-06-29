import { HATSVaultsRegistry_abi } from "@hats-finance/shared";
import { appChains } from "settings";
import { ICreateVaultOnChainCall } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { getNetwork, writeContract } from "wagmi/actions";

export class CreateVaultContract {
  /**
   * Returns a caller function to create a new vault.
   *
   * @remarks
   * This method is only for v2 vaults.
   *
   * @param vaultData - The data for creating the new vault
   */
  static send = async (vaultData: ICreateVaultOnChainCall) => {
    const { chain } = getNetwork();
    if (!chain) return null;

    const registryAddress = appChains[vaultData.chainId].vaultsCreatorContract;
    const registryAbi = HATSVaultsRegistry_abi;

    if (!registryAddress) {
      alert(`No registry address found for this chain ${vaultData.chainId}. Please contact the devs.`);
      return null;
    }

    await switchNetworkAndValidate(chain!.id, vaultData.chainId);
    const createVault = await writeContract({
      mode: "recklesslyUnprepared",
      address: registryAddress as `0x${string}`,
      abi: registryAbi,
      functionName: "createVault",
      args: [
        {
          name: vaultData.name,
          symbol: vaultData.symbol,
          asset: vaultData.asset as `0x${string}`,
          committee: vaultData.committee as `0x${string}`,
          owner: vaultData.owner as `0x${string}`,
          isPaused: vaultData.isPaused,
          rewardControllers: [],
          vestingPeriods: vaultData.vestingPeriods,
          vestingDuration: vaultData.vestingDuration,
          descriptionHash: vaultData.descriptionHash,
          maxBounty: vaultData.maxBounty,
          bountySplit: {
            hackerVested: vaultData.bountySplit.hackerVested,
            hacker: vaultData.bountySplit.hacker,
            committee: vaultData.bountySplit.committee,
          },
        },
      ],
    });

    return createVault;
  };
}
