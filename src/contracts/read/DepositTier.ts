import { IVault } from "types/types";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";
import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";

export class DepositTierContract {
  static contractInfo = (vault?: IVault, account?: string | undefined) => {
    const proxyAddress = vault?.master.address ? NFTContractDataProxy[vault?.master.address] : undefined;
    return {
      address: vault?.chainId ? ChainsConfig[vault?.chainId].vaultsNFTContract : undefined,
      abi: hatVaultNftAbi as any,
      functionName: "getTierFromShares",
      chainId: vault?.chainId,
      args: [proxyAddress, vault?.pid, account],
    };
  };
}
