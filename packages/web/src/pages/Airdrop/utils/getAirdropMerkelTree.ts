import { ethers } from "ethers";
import { keccak256 } from "ethers/lib/utils.js";
import MerkleTree from "merkletreejs";
import { AirdropMerkeltree } from "../types";

const hashToken = (address: string, amount: number) => {
  return Buffer.from(ethers.utils.solidityKeccak256(["address", "uint256"], [address, amount]).slice(2), "hex");
};

export const getAirdropMerkelTree = async (merkelTreeJSON: AirdropMerkeltree) => {
  return new MerkleTree(
    Object.entries(merkelTreeJSON).map(([address, data]) => {
      const amount = Object.keys(data).reduce((acc, key) => acc + parseInt(data[key] ?? 0), 0);
      return hashToken(address, amount);
    }),
    keccak256,
    { sortPairs: true }
  );
};
