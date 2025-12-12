import { HATVaultsNFT_abi } from "@hats.finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { appChains } from "settings";
import { IVault } from "types";

export class DepositTierContract {
  static contractInfo = (vault?: IVault, account?: string) => {
    // Only return contract info if we have a valid proxy address
    const proxyAddress =
      vault?.master.address && NFTContractDataProxy[vault.master.address]
        ? NFTContractDataProxy[vault.master.address]
        : undefined;

    // If no valid proxy address, return undefined to skip this contract call
    if (!proxyAddress || !vault?.chainId) {
      return undefined;
    }

    return {
      address: appChains[vault.chainId].vaultsNFTContract as `0x${string}`,
      abi: HATVaultsNFT_abi as any,
      functionName: "getTierFromShares",
      chainId: vault.chainId,
      args: [proxyAddress, vault.pid, account],
    };
  };

  static mapResponseToData = (res: any): number | undefined => {
    return res.data as number | undefined;
  };
}
