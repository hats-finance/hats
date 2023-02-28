import { HATVaultsNFT_abi, ChainsConfig } from "@hats-finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { IVault } from "types";

export class DepositRedeeemContract {
  static contractInfo = (vault?: IVault, account?: string) => {
    const proxyAddress = vault ? NFTContractDataProxy[vault.master.address] : undefined;
    return {
      mode: "recklesslyUnprepared",
      address: vault?.chainId ? ChainsConfig[vault?.chainId].vaultsNFTContract : undefined,
      abi: HATVaultsNFT_abi as any,
      functionName: "redeemMultipleFromShares",
      chainId: vault?.chainId,
      args: [[proxyAddress], [Number(vault?.pid)], account],
    };
  };
}
