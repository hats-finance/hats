import { useCall, useContractFunction } from "@usedapp/core";
import { Transactions } from "constants/constants";
import { BigNumber, Contract, ContractInterface } from "ethers";
import { IVault } from "types/types";
import erc20Abi from "data/abis/erc20.json";
import vaultAbiV1 from "data/abis/HATSVaultV1.json";
import vaultAbiV2 from "data/abis/HATSVaultV2.json";

export function usePendingReward(address: string, pid: string, account: string): BigNumber | undefined {
  return;
  const { value, error } =
    useCall({
      contract: new Contract(address, vaultAbiV1),
      method: "pendingReward",
      args: [pid, account],
    }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useUserSharesPerVault(address: string, pid: string, account: string) {
  return;
  const { value, error } =
    useCall({
      contract: new Contract(address, vaultAbiV1),
      method: "userInfo",
      args: [pid, account],
    }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useWithdrawRequestInfo(address: string, pid: string, account: string): BigNumber | undefined {
  return;
  const { value, error } =
    useCall({ contract: new Contract(address, vaultAbiV1), method: "withdrawRequests", args: [pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useTokenApprove(tokenAddress: string) {
  return useContractFunction(new Contract(tokenAddress, erc20Abi), "approve", { transactionName: Transactions.Approve });
}

export function useDepositAndClaim(vault: IVault) {
  let address: string;
  let vaultAbi: ContractInterface;

  if (vault?.version === "v2") {
    address = vault.id;
    vaultAbi = vaultAbiV2;
  } else {
    address = vault.master.address;
    vaultAbi = vaultAbiV1;
  }

  const depositAndClaim = useContractFunction(new Contract(address, vaultAbi), "deposit", {
    transactionName: Transactions.DepositAndClaim,
  });

  return {
    ...depositAndClaim,
    send: (amount: BigNumber) => {
      if (vault?.version === "v2") {
        return depositAndClaim.send(amount);
      } else {
        return depositAndClaim.send(vault.pid, amount);
      }
    },
  };
}

export function useWithdrawAndClaim(address: string) {
  return useContractFunction(new Contract(address, vaultAbiV1), "withdraw", { transactionName: Transactions.WithdrawAndClaim });
}

export function useWithdrawRequest(address: string) {
  return useContractFunction(new Contract(address, vaultAbiV1), "withdrawRequest", {
    transactionName: Transactions.WithdrawRequest,
  });
}

export function useClaim(address?: string) {
  return useContractFunction(address ? new Contract(address, vaultAbiV1) : null, "claim", { transactionName: "Claim" });
}

export function useClaimReward(address: string) {
  return useContractFunction(new Contract(address, vaultAbiV1), "claimReward", { transactionName: Transactions.ClaimReward });
}

export function useCheckIn(address: string) {
  return useContractFunction(new Contract(address, vaultAbiV1), "checkIn", { transactionName: Transactions.CheckIn });
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
