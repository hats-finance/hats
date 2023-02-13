import { getNetwork, writeContract } from "wagmi/actions";
import { ICreateVaultOnChainCall } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultsRegistry_abi } from "@hats-finance/shared";
import { ChainsConfig } from "config/chains";

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

    const registryAddress = ChainsConfig[vaultData.chainId].vaultsCreatorContract;
    const registryAbi = HATSVaultsRegistry_abi;

    if (!registryAddress) {
      alert(`No registry address found for this chain ${vaultData.chainId}. Please contact the devs.`);
      return null;
    }

    await switchNetworkAndValidate(chain!.id, vaultData.chainId);
    const createVault = await writeContract({
      mode: "recklesslyUnprepared",
      address: registryAddress,
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
          rewardControllers: [vaultData.rewardController as `0x${string}`],
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
