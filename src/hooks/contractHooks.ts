import { Contract } from "@ethersproject/contracts";
import { useCall, useContractFunction } from "@usedapp/core";
import { BigNumber } from "ethers";
import { MASTER_ADDRESS, NFT_AIRDROP_ADDRESS, TOKEN_AIRDROP_ADDRESS } from "settings";
import { checkMasterAddress } from "utils";
import erc20Abi from "../data/abis/erc20.json";
import vaultAbi from "../data/abis/HATSVault.json";
import NFTAirdrop from "../data/abis/NFTAirdrop.json";
import TokenAirdrop from "../data/abis/TokenAirdrop.json";

export function usePendingReward(
  address: string,
  pid: string,
  account: string
): BigNumber | undefined {
  const { value, error } =
    useCall({
      contract: new Contract(address, vaultAbi),
      method: "pendingReward",
      args: [pid, account]
    }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useCalcClaimRewards(
  pid?: string,
  severity?: number
): {
  hackerReward: BigNumber;
} | undefined {
  const { value, error } = useCall({
    contract: new Contract(MASTER_ADDRESS, vaultAbi),
    method: "calcClaimRewards",
    args: [pid, severity]
  }) ?? {};
  if (error) {
    return undefined;
  }
  return value;
}

export function useTokenApprove(tokenAddress: string) {
  return useContractFunction(new Contract(tokenAddress, erc20Abi), "approve", { transactionName: "Approve" });
}

export function useDepositAndClaim(address: string) {
  checkMasterAddress(address);
  return useContractFunction(new Contract(address, vaultAbi), "deposit", { transactionName: "deposit and claim" });
}

export function useWithdrawAndClaim(address: string) {
  checkMasterAddress(address);
  return useContractFunction(new Contract(address, vaultAbi), "withdraw", { transactionName: "Withdraw And Claim" });
}

export function useWithdrawRequest(address: string) {
  checkMasterAddress(address);
  return useContractFunction(
    new Contract(address, vaultAbi),
    "withdrawRequest",
    { transactionName: "Withdraw Request" }
  );
}

export function useClaim(address: string) {
  checkMasterAddress(address);
  return useContractFunction(new Contract(address, vaultAbi), "claim", { transactionName: "Claim" });
}

export function useClaimReward(address: string) {
  checkMasterAddress(address);
  return useContractFunction(new Contract(address, vaultAbi), "claimReward", { transactionName: "Claim Reward" });
}

export function useCheckIn(address: string) {
  checkMasterAddress(address);
  return useContractFunction(new Contract(address, vaultAbi), "checkIn", { transactionName: "Check In" });
}

export function useRedeemNFT() {
  return useContractFunction(new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop), "redeem", { transactionName: "Redeem NFT" });
}

export function useDelegateAndClaim() {
  return useContractFunction(new Contract(TOKEN_AIRDROP_ADDRESS, TokenAirdrop), "delegateAndClaim", { transactionName: "Delegate And Claim" });
}

export function usePendingApprovalClaim() {
  return useContractFunction(new Contract(MASTER_ADDRESS, vaultAbi), "pendingApprovalClaim", { transactionName: "Pending Approval Claim" });
}