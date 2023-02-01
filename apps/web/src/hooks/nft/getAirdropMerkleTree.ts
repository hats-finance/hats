import { Bytes, Contract } from "ethers";
import { AirdropMachineWallet } from "./types";
import { ipfsTransformUri } from "utils";

interface MerkleTreeChanged {
  merkleTreeIPFSRef: string;
  deadline: number;
  root: Bytes;
}

export async function getAirdropMerkleTree(contract: Contract) {
  const data = contract?.filters.MerkleTreeChanged();
  if (!data) return;
  const filter = await contract?.queryFilter(data, 0);
  if (!filter) return;
  // parse all elements
  const lastElement = filter[filter.length - 1] as any | undefined;

  const args = lastElement?.args as MerkleTreeChanged | undefined;
  //todo: check if deadline is passed
  const response = await fetch(ipfsTransformUri(args?.merkleTreeIPFSRef));
  const ipfsContent = (await response.json()) as {
    [index: string]: AirdropMachineWallet;
  };
  return Object.entries(ipfsContent).map(([wallet, data]) => ({
    ...data,
    address: wallet
  })) as AirdropMachineWallet[];
}
