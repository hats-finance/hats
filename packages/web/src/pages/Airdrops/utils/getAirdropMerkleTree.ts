import { BigNumber, ethers } from "ethers";
import { keccak256 } from "ethers/lib/utils.js";
import MerkleTree from "merkletreejs";
import { DropDescriptionData } from "../types";

export const hashToken = (address: string, amount: BigNumber) => {
  return Buffer.from(ethers.utils.solidityKeccak256(["address", "uint256"], [address, amount]).slice(2), "hex");
};

// Transforms the airdrople tree JSON into a MerkleTree object
// From AirdropMerkletree to { [address: string]: string (totalAmount) }
export const getAirdropMerkleTree = async (merkleTreeJSON: DropDescriptionData["merkletree"]) => {
  return new MerkleTree(
    Object.entries(merkleTreeJSON).map(([address, data]) => {
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
