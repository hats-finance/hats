import { HATVaultsNFT_abi } from "@hats.finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { appChains } from "settings";
import { IVault } from "types";

export class DepositRedeeemContract {
  static contractInfo = (vault?: IVault, account?: string) => {
    const proxyAddress = vault ? NFTContractDataProxy[vault.master.address] : undefined;
    return {
      mode: "recklesslyUnprepared",
      address: vault?.chainId ? appChains[vault?.chainId].vaultsNFTContract : undefined,
      abi: HATVaultsNFT_abi as any,
      functionName: "redeemMultipleFromShares",
      chainId: vault?.chainId,
      args: [[proxyAddress], [Number(vault?.pid)], account],
    };
  };
}
