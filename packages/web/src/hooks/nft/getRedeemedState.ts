import { readContract } from "wagmi/actions";
import { HATVaultsNFT_abi } from "@hats-finance/shared";
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
    abi: HATVaultsNFT_abi,
    chainId,
    functionName: "balanceOfBatch",
    args: [nfts.map((_) => address as `0x${string}`), nfts.map((nft) => nft.tokenId)],
  })) as any;
  return redeemedPerNft.map((redeemed, index) => ({
    ...nfts[index],
    redeemed: redeemed.toNumber() > 0,
  }));
}
