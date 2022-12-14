import { NFTContractDataProxy } from "constants/constants";
import { solidityKeccak256, keccak256 } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";
import {} from "ethers/lib/utils";
import { AirdropMachineWallet, INFTTokenInfo, IVaultIdentifier } from "./types";

export const buildMerkleTree = (merkleTree: AirdropMachineWallet[]) =>
  new MerkleTree(
    merkleTree
      .map((wallet) =>
        wallet.nft_elegebility.map((nft) =>
          hashToken(NFTContractDataProxy[nft.masterAddress.toLowerCase()], Number(nft.pid), wallet.address, nft.tier)
        )
      )
      .flat(),
    keccak256,
    { sortPairs: true }
  );

export const hashToken = (hatVaults: string, pid: number, account: string, tier: number) => {
  return Buffer.from(
    solidityKeccak256(["address", "uint256", "address", "uint8"], [hatVaults, pid, account, tier]).slice(2),
    "hex"
  );
};

export function getPidsWithAddresses(nfts: INFTTokenInfo[]) {
  return nfts.reduce((result, nft) => {
    if (
      !result.find(
        (pidWithAddress) => Number(pidWithAddress.pid) === Number(nft.pid) && pidWithAddress.masterAddress === nft.masterAddress
      )
    ) {
      result.push({
        pid: String(nft.pid),
        masterAddress: nft.masterAddress,
        proxyAddress: nft.proxyAddress,
        chainId: nft.chainId,
      });
    }
    return result;
  }, [] as IVaultIdentifier[]);
}

export const groupBy = <T, K extends keyof T>(list: T[], key: K) =>
  list.reduce((previous, currentItem) => {
    const group = String(currentItem[key]);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<string, T[]>);
