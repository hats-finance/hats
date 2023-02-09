import { getContract, getProvider } from "wagmi/actions";
import { ChainsConfig } from "config/chains";
import { HATVaultsNFT_abi } from "@hats-finance/shared";

export async function getNftContract(chainId: number) {
  const providerForChain = getProvider({ chainId });
  const contractAddress = ChainsConfig[chainId].vaultsNFTContract;
  if (!contractAddress) return null;

  // get contract for this chain
  return getContract({
    abi: HATVaultsNFT_abi,
    address: contractAddress,
    signerOrProvider: providerForChain,
  });
}
