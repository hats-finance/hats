import { getContract, getProvider } from "@wagmi/core";
import { ChainsConfig } from "config/chains";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";

export async function getNftContract(chainId: number) {
  const providerForChain = await getProvider({ chainId });
  const contractAddress = ChainsConfig[chainId].vaultsNFTContract;
  if (!contractAddress) return null;

  // get contract for this chain
  return await getContract({
    abi: hatVaultNftAbi,
    address: contractAddress,
    signerOrProvider: providerForChain
  });
}
