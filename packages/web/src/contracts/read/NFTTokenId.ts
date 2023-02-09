import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";
import { HATVaultsNFT_abi } from "@hats-finance/shared";
import { INFTToken } from "hooks/nft/types";

export class NFTTokenIdContract {
  static contractInfo = ({ masterAddress, pid, chainId, tier }: INFTToken) => {
    const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
    return {
      address: ChainsConfig[chainId].vaultsNFTContract,
      abi: HATVaultsNFT_abi,
      functionName: "getTokenId",
      chainId: chainId,
      args: [proxyAddress, pid, tier],
    };
  };
}
