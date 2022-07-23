import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { HATVaultsNFTContract } from "constants/constants";
import { BigNumber, Contract } from "ethers";
import { CHAINID } from "settings";
import hatVaultNftAbi from "../data/abis/HATVaultsNFT.json";

export function useTokenActions() {
  const { library } = useEthers();
  const provider = library;
  const signer = provider?.getSigner();
  const contract = new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi, signer);

  const isTokenRedeemed = async (pid: number, tier: number, account: string): Promise<boolean> => {
    return await contract.tokensRedeemed(pid, tier, account);
  }

  const getTokenId = async (account: string, pid: number, tier: number): Promise<number> => {
    return await contract.tokenIds(account, pid, tier);
  }

  const getTokenUri = async (tokenId: number): Promise<string> => {
    return await contract.uri(tokenId);
  }

  return {
    isTokenRedeemed,
    getTokenId,
    getTokenUri
  }
}


export function useRedeemMultipleFromTree() {
  return useContractFunction(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
}

export function useRedeemMultipleFromShares() {
  return useContractFunction(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), "redeemMultipleFromShares", { transactionName: "Redeem NFTs" });
}

export function useGetTierFromShares(pid: number, account: string): number | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "getTierFromShares", args: [HAT_VAULTS_CONSTANT, pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Relevant only for Airdrop */
export function useDeadline(): string | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "deadline", args: [] }) ?? {};
  if (error) {
    return undefined;
  }
  return (value?.[0] as BigNumber)?.toString();
}
