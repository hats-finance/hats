import { useCall, useContractFunction } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { HATVaultsNFTContract } from "constants/constants";
import { Contract } from "ethers";
import { CHAINID } from "settings";
import hatVaultNftAbi from "../data/abis/HATVaultsNFT.json";

export function useRedeemMultipleFromTree() {
  return useContractFunction(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
}

export function useRedeemMultipleFromShares() {
  return useContractFunction(new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), "redeemMultipleFromShares", { transactionName: "Redeem NFTs" });
}

export function useTokensRedeemed(pid: string, tier: number, account: string ): Boolean {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "tokensRedeemed", args: [HAT_VAULTS_CONSTANT, pid, tier, account] }) ?? {};
  if (error) {
    return false;
  }
  return value?.[0];
}

export function useTokenIds(account: string, pid: string, tier: number ): string | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "tokenIds", args: [account, pid, tier] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useGetTierFromShares(pid: string, account: string): number | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "getTierFromShares", args: [HAT_VAULTS_CONSTANT, pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Fetch the URI to show the NFT image */
export function useUri(tokenId: string) {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "uri", args: [tokenId] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Relevant only for airdrop */
export function useDeadline() {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "deadline", args: [] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}
