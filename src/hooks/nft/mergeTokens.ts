import { INFTTokenInfo } from "./types";

export function mergeTokens(treeTokens: INFTTokenInfo[] | undefined, proofTokens: INFTTokenInfo[] | undefined) {
  return [...(treeTokens || ([] as INFTTokenInfo[])), ...(proofTokens || [])].reduce((prev, curr) => {
    const exists = prev.find((nft) => nft.tokenId.eq(curr.tokenId));
    if (exists) {
      if (curr.isDeposit) exists.isDeposit = true;
      if (curr.isMerkleTree) exists.isMerkleTree = true;
    } else prev.push(curr);
    return prev;
  }, [] as INFTTokenInfo[]);
}
