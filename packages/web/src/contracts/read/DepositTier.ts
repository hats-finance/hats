import { HATVaultsNFT_abi } from "@hats.finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { appChains } from "settings";
import { IVault } from "types";

export class DepositTierContract {
  static contractInfo = (vault?: IVault, account?: string) => {
    // Normalize vault.master.address before indexing NFTContractDataProxy
    const masterAddress = vault?.master.address?.toLowerCase();
    const proxyAddress = masterAddress ? NFTContractDataProxy[masterAddress] : undefined;

    // If no valid proxy address, chainId, pid, or account, return undefined to skip this contract call
    if (!proxyAddress || !vault?.chainId || vault?.pid === undefined || !account) {
      return undefined;
    }

    // Guard appChains[vault.chainId] to avoid runtime crash on unsupported chainIds
    const chainCfg = appChains[vault.chainId];
    if (!chainCfg?.vaultsNFTContract) return undefined;

    return {
      address: chainCfg.vaultsNFTContract as `0x${string}`,
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
