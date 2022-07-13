import { useCall, useContractFunction } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import erc20Abi from "../data/abis/erc20.json";
import vaultAbi from "../data/abis/HATSVault.json";

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

export function useUserSharesPerVault(
  address: string,
  pid: string,
  account: string
) {
  const { value, error } = useCall({
    contract: new Contract(address, vaultAbi),
    method: "userInfo",
    args: [pid, account]
  }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useWithdrawRequestInfo(address: string, pid: string, account: string): BigNumber | undefined {
  const { value, error } = useCall({ contract: new Contract(address, vaultAbi), method: "withdrawRequests", args: [pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useTokenApprove(tokenAddress: string) {
  return useContractFunction(new Contract(tokenAddress, erc20Abi), "approve", { transactionName: "Approve" });
}

export function useDepositAndClaim(address: string) {
  return useContractFunction(new Contract(address, vaultAbi), "deposit", { transactionName: "deposit and claim" });
}

export function useWithdrawAndClaim(address: string) {
  return useContractFunction(new Contract(address, vaultAbi), "withdraw", { transactionName: "Withdraw And Claim" });
}

export function useWithdrawRequest(address: string) {
  return useContractFunction(
    new Contract(address, vaultAbi),
    "withdrawRequest",
    { transactionName: "Withdraw Request" }
  );
}

export function useClaim(address: string) {
  return useContractFunction(new Contract(address, vaultAbi), "claim", { transactionName: "Claim" });
}

export function useClaimReward(address: string) {
  return useContractFunction(new Contract(address, vaultAbi), "claimReward", { transactionName: "Claim Reward" });
}

export function useCheckIn(address: string) {
  return useContractFunction(new Contract(address, vaultAbi), "checkIn", { transactionName: "Check In" });
}

// export function useContract<T extends TypedContract, FN extends ContractFunctionNames<T>>(
//   contract: T,
//   functionName: FN,
//   options?: TransactionOptions
// ) {
//   const dispatch = useDispatch();
//   const { send: originalSend, state, events, resetState } = useContractFunction(contract, functionName, options);
//   return {
//     send: async (...args: Parameters<T['functions'][FN]>) => {
//       dispatch(setCurrentTransactionState(state))
//       return await originalSend(...args)
//     }, state, events, resetState
//   }
// }