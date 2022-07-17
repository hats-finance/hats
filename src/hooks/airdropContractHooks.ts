import { useCall, useContractFunction } from "@usedapp/core";
import { Contract } from "ethers";
import hatVaultNftAbi from "../data/abis/HATVaultsNFT.json";

//  hatVaults: string[], pids: number[], account: string, tiers: number[], proofs: any[]
export function useRedeemMultipleFromTree(address: string) {
  return useContractFunction(new Contract(address, hatVaultNftAbi), "redeemMultipleFromTree", { transactionName: "Redeem NFTs" });
}

export function useIsEligible(address: string, hatVaults: string, pid: number, account: string): boolean {
  const { value, error } = useCall({ contract: new Contract(address, hatVaultNftAbi), method: "isEligible", args: [hatVaults, pid, account] }) ?? {};
  if (error) {
    return false;
  }
  return value?.[0];
}
