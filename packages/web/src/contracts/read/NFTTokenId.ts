import { HATVaultsNFT_abi } from "@hats-finance/shared";
import { appChains } from "settings";
import { NFTContractDataProxy } from "constants/constants";
import { INFTToken } from "hooks/nft/types";

export class NFTTokenIdContract {
  static contractInfo = ({ masterAddress, pid, chainId, tier }: INFTToken) => {
    const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
    return {
      address: appChains[chainId].vaultsNFTContract,
      abi: HATVaultsNFT_abi,
      functionName: "getTokenId",
      chainId: chainId,
      args: [proxyAddress, pid, tier],
    };
  };
}
