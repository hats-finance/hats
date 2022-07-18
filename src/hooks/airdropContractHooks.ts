import { useCall, useContractFunction } from "@usedapp/core";
import { HATVaultsNFTContract } from "constants/constants";
import { BigNumber, Contract } from "ethers";
import { CHAINID } from "settings";
import hatVaultNftAbi from "../data/abis/HATVaultsNFT.json";

//  hatVaults: string[], pids: number[], account: string, tiers: number[], proofs: any[]
export function useRedeemMultipleFromTree(address: string) {
  return useContractFunction(new Contract(address, hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
}

export function useRedeemMultipleFromShares(address: string) {
  return useContractFunction(new Contract(address, hatVaultNftAbi), "redeemMultipleFromShares", { transactionName: "Redeem NFTs" });
}

// export function useIsEligible(address: string, hatVaults: string, pid: number, account: string): boolean {
//   const { value, error } = useCall({ contract: new Contract(address, hatVaultNftAbi), method: "isEligible", args: [hatVaults, pid, account] }) ?? {};
//   if (error) {
//     return false;
//   }
//   return value?.[0];
// }

/**
 * 1. fetch tokensIDcounter
 * 2. Run balanceOf until tokensIDcounter (already redeemed)
 * 3. getTierFromShares (hasn’t redeemed yet)
 * 4. display using uri
 */
export function useTokenIdsCounter(): BigNumber | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "tokenIdsCounter", args: [] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Already redeemed */
export function useBalanceOf(account: string, id: number): BigNumber | undefined {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "balanceOf", args: [account, id] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Not redeemed yet */
export function useGetTierFromShares(hatVaults: string, pid: string, account: string) {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "getTierFromShares", args: [hatVaults, pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

/** Fetch the URI to show the NFT image */
export function useUri(id: string) {
  const { value, error } = useCall({ contract: new Contract(HATVaultsNFTContract[CHAINID], hatVaultNftAbi), method: "uri", args: [id] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}
