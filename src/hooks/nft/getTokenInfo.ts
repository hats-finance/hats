import { NFTContractDataProxy } from "constants/constants";
import { Contract } from "ethers";
import { ipfsTransformUri } from "utils";
import { INFTToken, INFTTokenInfo, INFTTokenMetadata } from "./types";

export async function getTokenInfo(token: INFTToken, nftContract: Contract): Promise<INFTTokenInfo | undefined> {
  const { tier, masterAddress, pid } = token;
  const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
  const tokenId = await nftContract.getTokenId(proxyAddress, pid, tier);
  const tokenUri = await nftContract.uri(tokenId);
  if (!tokenUri) return;
  const res = await fetch(ipfsTransformUri(tokenUri));
  const metadata = (await res.json()) as INFTTokenMetadata;
  return {
    ...token,
    tokenId,
    metadata,
    isDeposit: true,
    isMerkleTree: false
  };
}
