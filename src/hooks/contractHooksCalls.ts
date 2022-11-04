import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { Transactions } from "constants/constants";
import { BigNumber, Contract } from "ethers";
import { IVault } from "types/types";
import erc20Abi from "data/abis/erc20.json";
import vaultAbiV1 from "data/abis/HATSVaultV1.json";
import vaultAbiV2 from "data/abis/HATSVaultV2.json";
import rewardControllerAbi from "data/abis/RewardController.json";
import { t } from "i18next";

// TODO: NO VERSION 1 SUPPORT / ONLY V2 -> ALWAYS ZERO ON V1
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

// V1 -> pid, account
// v2 -> balanceOf (will return the shares) -> previewRedeem (converts shares to tokens)
/**
 * Returns the amount of shares the user has on the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from
 * @returns The userShares
 */
export function useUserSharesPerVault(vault: IVault): BigNumber | undefined {
  const { account } = useEthers();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;
  const method = vault.version === "v1" ? "userInfo" : "balanceOf";
  const args = vault.version === "v1" ? [vault.pid, account] : [account];

  const { value, error } =
    useCall({
      contract: new Contract(contractAddress, vaultAbi),
      method: method,
      args,
    }) ?? {};

  const userShares: BigNumber | undefined = !error ? value?.[0] : undefined;
  return userShares;
}

/**
 * Returns the amount of shares the user has and the value of those shares (balance) on staking token.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from
 * @returns The userShares and the userBalance
 */
export function useUserSharesAndBalancePerVault(vault: IVault): {
  userSharesAvailable: BigNumber | undefined;
  userBalanceAvailable: BigNumber | undefined;
} {
  const userSharesAvailable = useUserSharesPerVault(vault);

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;
  const method = vault.version === "v1" ? "poolInfo" : "previewRedeem";
  const args = vault.version === "v1" ? [vault.pid] : [userSharesAvailable];

  const { value, error } =
    useCall({
      contract: new Contract(contractAddress, vaultAbi),
      method: method,
      args,
    }) ?? {};

  let userBalanceAvailable: BigNumber | undefined = undefined;

  if (!error) {
    if (vault.version === "v1") {
      const totalShares: BigNumber = value.totalUsersAmount;
      const totalBalance: BigNumber = value.balance;

      userBalanceAvailable = userSharesAvailable?.mul(totalBalance).div(totalShares);
    } else {
      userBalanceAvailable = value?.[0];
    }
  }

  return { userSharesAvailable, userBalanceAvailable };
}

// V1 -> pid, account => returns a time
// v2 -> withdrawEnableStartTime (with user account) => returns a time
export function useWithdrawRequestInfo(address: string, vault: IVault, account: string | undefined): BigNumber | undefined {
  return;
  const { value, error } =
    useCall({ contract: new Contract(address, vaultAbiV1), method: "withdrawRequests", args: [vault.pid, account] }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

//READY -> supporting v1 and v2
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

//READY -> supporting v1 and v2
export function useDeposit(vault: IVault) {
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;

  const deposit = useContractFunction(new Contract(contractAddress, vaultAbi), "deposit", {
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

//READY -> supporting v1 and v2
export function useWithdrawAndClaim(vault: IVault) {
  const { account } = useEthers();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const contractFunctionName = vault.version === "v1" ? "withdraw" : "withdrawAndClaim";
  const vaultAbi = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;

  const withdrawAndClaim = useContractFunction(new Contract(contractAddress, vaultAbi), contractFunctionName, {
    transactionName: Transactions.WithdrawAndClaim,
  });

  return {
    ...withdrawAndClaim,
    send: (amount: BigNumber) => {
      if (vault?.version === "v2") {
        // [params]: assets (ammount in tokens), receiver, owner
        return withdrawAndClaim.send(amount, account, account);
      } else {
        // [params]: pid, shares
        return withdrawAndClaim.send(vault.pid, amount);
      }
    },
  };
}

//READY -> supporting v1 and v2
export function useWithdrawRequest(vault: IVault) {
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;

  const withdrawRequest = useContractFunction(new Contract(contractAddress, vaultAbi), "withdrawRequest", {
    transactionName: Transactions.WithdrawRequest,
  });

  return {
    ...withdrawRequest,
    send: () => {
      if (vault?.version === "v2") {
        // [params]: none
        return withdrawRequest.send();
      } else {
        // [params]: pid
        return withdrawRequest.send(vault.pid);
      }
    },
  };
}

// v1 -> claim
// v2 -> registry -> logClaim
// TODO:[v2] add support to v2
export function useClaim(address?: string) {
  return useContractFunction(address ? new Contract(address, vaultAbiV1) : null, "claim", { transactionName: "Claim" });
}

//READY -> supporting v1 and v2
export function useClaimReward(vault: IVault) {
  const { account } = useEthers();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.rewardController.id;
  const abi = vault.version === "v1" ? vaultAbiV1 : rewardControllerAbi;

  const claimReward = useContractFunction(new Contract(contractAddress, abi), "claimReward", {
    transactionName: Transactions.ClaimReward,
  });

  return {
    ...claimReward,
    send: () => {
      if (vault?.version === "v2") {
        // [params]: vault, user
        return claimReward.send(vault.id, account);
      } else {
        // [params]: pid
        return claimReward.send(vault.pid);
      }
    },
  };
}

export function useCommitteeCheckIn(vault: IVault) {
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? vaultAbiV1 : vaultAbiV2;

  const committeeCheckIn = useContractFunction(new Contract(contractAddress, vaultAbi), "committeeCheckIn", {
    transactionName: Transactions.CheckIn,
  });

  return {
    ...committeeCheckIn,
    send: () => {
      if (vault?.version === "v2") {
        // [params]: none
        return committeeCheckIn.send();
      } else {
        // [params]: pid
        return committeeCheckIn.send(vault.pid);
      }
    },
  };
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
