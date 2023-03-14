import { HATVaultsNFT_abi } from "@hats-finance/shared";
import { getContract, getProvider } from "wagmi/actions";
import { appChains } from "settings";

export async function getNftContract(chainId: number) {
  const providerForChain = getProvider({ chainId });
  const contractAddress = appChains[chainId].vaultsNFTContract;
  if (!contractAddress) return null;

  // get contract for this chain
  return getContract({
    abi: HATVaultsNFT_abi,
    address: contractAddress,
    signerOrProvider: providerForChain,
  });
}
