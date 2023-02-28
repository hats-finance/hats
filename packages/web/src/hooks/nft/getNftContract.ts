import { HATVaultsNFT_abi, ChainsConfig } from "@hats-finance/shared";
import { getContract, getProvider } from "wagmi/actions";

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
