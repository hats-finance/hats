import { HATVaultsNFT_abi } from "@hats.finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { appChains } from "settings";
import { IVault } from "types";

export class DepositTierContract {
  static contractInfo = (vault?: IVault, account?: string) => {
    const proxyAddress =
      vault?.master.address && NFTContractDataProxy[vault.master.address]
        ? NFTContractDataProxy[vault.master.address]
        : "0x0000000000000000000000000000000000000000";

    return {
      address: vault?.chainId ? (appChains[vault?.chainId].vaultsNFTContract as `0x${string}`) : undefined,
      abi: HATVaultsNFT_abi as any,
      functionName: "getTierFromShares",
      chainId: vault?.chainId,
      args: [proxyAddress, vault?.pid, account],
    };
  };

  static mapResponseToData = (res: any): number | undefined => {
    return res.data as number | undefined;
  };
}
