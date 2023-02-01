import { AirdropMachineWallet, INFTToken, INFTTokenInfo } from "./types";
import { Contract } from "ethers";
import { NFTContractDataProxy } from "constants/constants";

//get latest merkletree
export async function getAirdropTokens(
  chainId: number,
  addressInfo: AirdropMachineWallet,
  nftContract: Contract
): Promise<INFTTokenInfo[]> {
  const { nft_elegebility } = addressInfo;
  const airdropTokens = await Promise.all(
    nft_elegebility.map(async (nft) => {
      const { pid, tier: tiers, masterAddress } = nft;
      const tokens: INFTToken[] = [];
      return tokens;

      // for (let tier = 1; tier <= tiers; tier++) {
      //   tokens.push({
      //     chainId,
      //     masterAddress,
      //     proxyAddress: NFTContractDataProxy[masterAddress.toLowerCase()],
      //     pid: String(pid),
      //     tier,
      //   });
      // }
      // return Promise.all(tokens.map((token) => getTokenInfo(token, nftContract)));
    })
  );
  const nested = airdropTokens?.filter((nfts) => nfts !== null) as INFTTokenInfo[][];
  return nested.flat();
}

// this is a fix we did for the tree we probably don't need it anymore but i am leaving it here for now

// for (const wallet in ipfsContent) {
//   const nft_elegebility = ipfsContent[wallet].nft_elegebility as NFTEligibilityElement[];
//   // handle duplicate pid with different tier or same tier but different type for pid
//   const filtered = [] as NFTEligibilityElement[];
//   nft_elegebility.forEach(nft => {
//     const shouldAdd = nft_elegebility.find(innerNft => {
//       const samePid = Number(innerNft.pid) === Number(nft.pid) && innerNft.masterAddress === nft.masterAddress;
//       if (!samePid) return false;
//       const sameTier = Number(innerNft.tier) === Number(nft.tier);
//       if (sameTier && typeof innerNft.pid === 'string' && typeof nft.pid === 'number') return true;
//       if (nft.tier > innerNft.tier) return true;
//       return false;
//     });
//     if (shouldAdd)
//       filtered.push(nft);
//   });
//   tree.push({ address: wallet, ...ipfsContent[wallet], nft_elegebility: filtered });
// }
