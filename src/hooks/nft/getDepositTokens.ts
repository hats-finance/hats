import { MAX_NFT_TIER, NFTContractDataProxy } from "constants/constants";
import { Contract } from "ethers";
import { INFTToken, IVaultIdentifier } from "./types";
import { getTokenInfo } from "./getTokenInfo";

/**
 * we want to check if the user has deposited into the vaults enough to be eligible for the NFTs
 * but we don't want to query all the vaults for that, so we check the graph to check which vaults
 * the user has deposited into and then we query those vaults for the NFTs using the contract
 */
export async function getDepositTokens(vaults: IVaultIdentifier[], nftContract: Contract, address: string) {
  const eligibilitiesPerPid = await Promise.all(
    vaults.map(async (vault) => {
      const { pid, masterAddress } = vault;
      const proxyAddress = NFTContractDataProxy[masterAddress.toLowerCase()];
      const tiers = await nftContract.getTierFromShares(proxyAddress, pid, address);
      const tokens: INFTToken[] = [];
      for (let tier = 1; tier <= Math.min(MAX_NFT_TIER, tiers); tier++) {
        tokens.push({
          ...vault,
          tier
        });
      }
      return Promise.all(tokens.map((token) => getTokenInfo(token, nftContract)));
    })
  );
  return eligibilitiesPerPid.flat();
}
