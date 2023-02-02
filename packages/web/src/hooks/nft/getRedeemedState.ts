import { readContract } from "wagmi/actions";
import hatVaultNftAbi from "data/abis/HATVaultsNFT.json";
import { Contract } from "ethers";
import { INFTTokenInfo, INFTTokenInfoRedeemed } from "./types";

export async function getRedeemedState(
  address: string,
  chainId: number,
  nftContract: Contract,
  nfts: INFTTokenInfo[]
): Promise<INFTTokenInfoRedeemed[]> {
  const redeemedPerNft = (await readContract({
    address: nftContract.address as `0x${string}`,
    abi: hatVaultNftAbi,
    chainId,
    functionName: "balanceOfBatch",
    args: [nfts.map((_) => address), nfts.map((nft) => nft.tokenId)],
  })) as any;
  return redeemedPerNft.map((redeemed, index) => ({
    ...nfts[index],
    redeemed: redeemed.toNumber() > 0,
  }));
}
