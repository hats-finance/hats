import { IVault } from "types";
import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";
import { HATVaultsNFT_abi } from "@hats-finance/shared";

export class DepositTierContract {
  static contractInfo = (vault?: IVault, account?: string) => {
    const proxyAddress =
      vault?.master.address && NFTContractDataProxy[vault.master.address]
        ? NFTContractDataProxy[vault.master.address]
        : "0x0000000000000000000000000000000000000000";

    return {
      address: vault?.chainId ? ChainsConfig[vault?.chainId].vaultsNFTContract : undefined,
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
