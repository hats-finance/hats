import { useCall, useContractFunction } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { HATVaultsNFTContract } from "constants/constants";
import { Contract } from "ethers";
import { CHAINID } from "settings";
import hatVaultNftAbi from "../data/abis/HATVaultsNFT.json";

//  hatVaults: string[], pids: number[], account: string, tiers: number[], proofs: any[]
export function useRedeemMultipleFromTree(address: string) {
  return useContractFunction(new Contract(address, hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
}

export function useRedeemMultipleFromShares(address: string) {
  return useContractFunction(new Contract(address, hatVaultNftAbi), "redeemMultipleFromShares", { transactionName: "Redeem NFTs" });
}

/**
 * 1. fetch tokensIDcounter
 * 2. Run balanceOf until tokensIDcounter (already redeemed)
 * 3. getTierFromShares (hasn’t redeemed yet)
 * 4. display using uri
 */

export function useTokensRedeemed(pid: number, tier: number, account: string ): Boolean {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "tokensRedeemed", args: [HAT_VAULTS_CONSTANT, pid, tier, account] }) ?? {};
  if (error) {
    return false;
  }
  return value?.[0];
}

export function useTokenIds(account: string, pid: number, tier: number ): number | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "tokenIds", args: [account, pid, tier] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Not redeemed yet - traverse all the vautls */
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
