import { HATAirdrop_abi } from "@hats.finance/shared";
import { ipfsTransformUri } from "utils";
import { getContract, getProvider } from "wagmi/actions";
import { AirdropDescriptionData } from "../types";

export const getAirdropDescriptionJSON = async (airdropData: {
  address: string;
  chainId: number;
}): Promise<AirdropDescriptionData> => {
  const airdropContractAddress = airdropData.address;
  const chainId = airdropData.chainId;

  const provider = getProvider({ chainId });
  if (!airdropContractAddress) {
    alert(`Airdrop contract not found on chain ${chainId}`);
    throw new Error("Airdrop contract not found");
  }

  const airdropContract = getContract({
    abi: HATAirdrop_abi,
    address: airdropContractAddress,
    signerOrProvider: provider,
  });

  const filter = await airdropContract.queryFilter("MerkleTreeSet", 0);
  const latestEvent = filter[filter.length - 1];
  const args = latestEvent.args as { _merkleTreeIPFSRef: string } | undefined;

  if (!args) throw new Error("MerkleTreeSet event not found");

  const merkleTreeRes = await fetch(ipfsTransformUri(args?._merkleTreeIPFSRef));
  const merkleTreeJson = (await merkleTreeRes.json()) as AirdropDescriptionData;

  return {
    ...merkleTreeJson,
    // Retro compatibility with old merkletree key (typo `merkeltree`)
    merkletree: merkleTreeJson.merkletree ?? (merkleTreeJson as any).merkeltree,
  };
};
