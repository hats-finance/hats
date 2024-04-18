import { BigNumber, ethers } from "ethers";
import { keccak256 } from "ethers/lib/utils.js";
import MerkleTree from "merkletreejs";
import { AirdropMerkeltree } from "../types";

export const hashToken = (address: string, amount: BigNumber) => {
  return Buffer.from(ethers.utils.solidityKeccak256(["address", "uint256"], [address, amount]).slice(2), "hex");
};

// Transforms the airdrop merkel tree JSON into a MerkleTree object
// From AirdropMerkeltree to { [address: string]: string (totalAmount) }
export const getAirdropMerkelTree = async (merkelTreeJSON: AirdropMerkeltree) => {
  return new MerkleTree(
    Object.entries(merkelTreeJSON).map(([address, data]) => {
      const amount = Object.keys(data.token_eligibility).reduce(
        (acc, key) => acc.add(BigNumber.from(data.token_eligibility[key] ?? 0)),
        BigNumber.from(0)
      );
      return hashToken(address, amount);
    }),
    keccak256,
    { sortPairs: true }
  );
};
