import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { Transactions } from "constants/constants";
import { BigNumber, Contract, ContractInterface } from "ethers";
import { IVault } from "types/types";
import erc20Abi from "data/abis/erc20.json";
import vaultAbiV1 from "data/abis/HATSVaultV1.json";
import vaultAbiV2 from "data/abis/HATSVaultV2.json";
import { t } from "i18next";

export function usePendingReward(
  rewardControllerAddress: string,
  vaultAddress: string,
  account: string | undefined
): BigNumber | undefined {
  return;
  const { value, error } =
    useCall({
      contract: new Contract(rewardControllerAddress, vaultAbiV1),
      method: "getPendingReward",
      args: [vaultAddress, account],
    }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useUserSharesPerVault(address: string, vault: IVault, account: string | undefined): BigNumber | undefined {
  return;
  const { value, error } =
    useCall({
      contract: new Contract(address, vaultAbiV1),
      method: "userInfo",
      args: [vault.pid, account],
    }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useWithdrawRequestInfo(address: string, vault: IVault, account: string | undefined): BigNumber | undefined {
  return;
  const { value, error } =
    useCall({ contract: new Contract(address, vaultAbiV1), method: "withdrawRequests", args: [vault.pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useTokenApproveAllowance(vault: IVault) {
  const allowedContractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const approveAllowance = useContractFunction(new Contract(vault.stakingToken, erc20Abi), "approve", {
    transactionName: Transactions.Approve,
  });

  return {
    ...approveAllowance,
    send: (allowedAmount: BigNumber) => {
      // [params]: allowedContract, allowedAmount
      return approveAllowance.send(allowedContractAddress, allowedAmount);
    },
  };
}

export function useDeposit(vault: IVault) {
  const address = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi: ContractInterface = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;

  const deposit = useContractFunction(new Contract(address, vaultAbi), "deposit", {
    transactionName: Transactions.Deposit,
  });

  const { account } = useEthers();

  return {
    ...deposit,
    send: (amount: BigNumber) => {
      if (vault?.version === "v2") {
        // [params]: asset, receiver
        return deposit.send(amount, account);
      } else {
        // [params]: pid, amount
        return deposit.send(vault.pid, amount);
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
