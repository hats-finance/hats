import { HATSVaultsRegistry_abi } from "./../data/abis/HATSVaultsRegistry_abi";
import { useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import { IVault } from "types/types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";
import { RewardController_abi } from "data/abis/RewardController_abi";
import { erc20_abi } from "data/abis/erc20_abi";

/**
 * Returns the amount of pending reward to claim for a giver user
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user pending reward from
 * @returns The pending reward amount
 */
export function usePendingReward(vault: IVault): BigNumber | undefined {
  const { address: account } = useAccount();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.rewardController.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : RewardController_abi;
  const method = vault.version === "v1" ? "pendingReward" : "getPendingReward";
  const args = vault.version === "v1" ? [vault.pid, account] : [vault.id, account];

  const { data: res, isError } =
    useContractRead({
      address: contractAddress,
      abi: vaultAbi as any,
      functionName: method,
      scopeKey: "hats",
      chainId: vault.chainId,
      watch: true,
      args,
    }) ?? {};
  const data = res as any;

  let pendingReward: BigNumber | undefined = undefined;

  if (!isError && data) {
    pendingReward = data ?? BigNumber.from(0);
  }

  return pendingReward;
}

/**
 * Returns the total amount of shares on the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the total shares from
 * @returns The total shares amount
 */
export function useTotalSharesPerVault(vault: IVault): BigNumber {
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault.version === "v1" ? "poolInfo" : "totalSupply";
  const args = vault.version === "v1" ? [vault.pid] : [];

  const { data: res, isError } = useContractRead({
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: method,
    chainId: vault.chainId,
    scopeKey: "hats",
    watch: true,
    args,
  });
  const data = res as any;

  let totalSharesAmount: BigNumber = BigNumber.from(0);

  if (!isError && data) {
    if (vault.version === "v1") {
      totalSharesAmount = data.totalUsersAmount ?? BigNumber.from(0);
    } else {
      totalSharesAmount = data ?? BigNumber.from(0);
    }
  }

  return totalSharesAmount;
}

/**
 * Returns the amount of shares the user has on the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from
 * @returns The user shares amount
 */
export function useUserSharesPerVault(vault: IVault): BigNumber {
  const { address: account } = useAccount();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault.version === "v1" ? "userInfo" : "balanceOf";
  const args = vault.version === "v1" ? [vault.pid, account] : [account];

  const { data: res, isError } = useContractRead({
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: method,
    chainId: vault.chainId,
    scopeKey: "hats",
    watch: true,
    args,
  });
  const data = res as any;

  let userSharesAmount: BigNumber = BigNumber.from(0);

  if (!isError && data) {
    if (vault.version === "v1") {
      userSharesAmount = data.amount ?? BigNumber.from(0);
    } else {
      userSharesAmount = data ?? BigNumber.from(0);
    }
  }

  return userSharesAmount;
}

/**
 * Returns the amount of shares the user has and the value of those shares (balance) on staking token.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from and the balance of those shares
 * @returns The user shares amount and the user balance
 */
export function useUserSharesAndBalancePerVault(vault: IVault): {
  userSharesAvailable: BigNumber | undefined;
  userBalanceAvailable: BigNumber | undefined;
} {
  const userSharesAvailable = useUserSharesPerVault(vault);

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault.version === "v1" ? "poolInfo" : "previewRedeem";
  const args = vault.version === "v1" ? [vault.pid] : [userSharesAvailable];

  const { data: res, isError } = useContractRead({
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: method,
    chainId: vault.chainId,
    scopeKey: "hats",
    watch: true,
    args,
  });
  const data = res as any;

  let userBalanceAvailable: BigNumber | undefined = undefined;

  if (!isError && data) {
    if (vault.version === "v1") {
      const totalShares: BigNumber | undefined = data.totalUsersAmount;
      const totalBalance: BigNumber | undefined = data.balance;

      if (totalShares && totalBalance && userSharesAvailable) {
        if (!totalShares.eq(0)) {
          userBalanceAvailable = userSharesAvailable?.mul(totalBalance).div(totalShares);
        }
      }
    } else {
      userBalanceAvailable = data;
    }
  }

  return { userSharesAvailable, userBalanceAvailable };
}

/**
 * Returns the starting time in seconds when the user can withdraw from the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user withdraw start time from
 * @returns The user withdraw start time
 */
export function useWithdrawRequestStartTime(vault: IVault): BigNumber | undefined {
  const { address: account } = useAccount();
  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vault.version === "v1" ? "withdrawRequests" : "withdrawEnableStartTime";
  const args = vault.version === "v1" ? [vault.pid, account] : [account];

  const { data: res, isError } = useContractRead({
    enabled: !!account,
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: method,
    chainId: vault.chainId,
    scopeKey: "hats",
    watch: true,
    args,
  });
  const data = res as any;

  let startTimeNumber: BigNumber | undefined = undefined;

  if (!isError && data) {
    startTimeNumber = data ?? undefined;
  }

  return startTimeNumber && !startTimeNumber.eq(0) ? startTimeNumber : undefined;
}

/**
 * Returns a caller function to approve the vault to spend the user's staking token.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to give approval to spend the user's staking token
 */
export function useTokenApproveAllowance(vault: IVault) {
  const { chain } = useNetwork();

  const allowedContractAddress = vault.version === "v1" ? vault.master.address : vault.id;

  const approveAllowance = useContractWrite({
    mode: "recklesslyUnprepared",
    address: vault.stakingToken,
    abi: erc20_abi as any,
    functionName: "approve",
    chainId: vault.chainId,
  });

  return {
    ...approveAllowance,
    send: async (allowedAmount: BigNumber) => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      // [params]: allowedContract, allowedAmount
      return approveAllowance.write!({ recklesslySetUnpreparedArgs: [allowedContractAddress, allowedAmount] });
    },
  };
}

/**
 * Returns a caller function to deposit staking token to the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to deposit staking token
 */
export function useDeposit(vault: IVault) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

  const deposit = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: "deposit",
    chainId: vault.chainId,
  });

  return {
    ...deposit,
    /**
     * Call the deposit function.
     * @param amountInTokens - The amount in TOKENS (not shares) to deposit
     */
    send: async (amountInTokens: BigNumber) => {
      try {
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);

        if (vault?.version === "v2") {
          // [params]: asset, receiver
          return deposit.write!({ recklesslySetUnpreparedArgs: [amountInTokens, account] });
        } else {
          // [params]: pid, amount
          return deposit.write!({ recklesslySetUnpreparedArgs: [vault.pid, amountInTokens] });
        }
      } catch (error) {}
    },
  };
}

/**
 * Returns a caller function to withdraw the user's staking token and claim the available rewards
 * from the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to withdraw and claim the tokens from
 */
export function useWithdrawAndClaim(vault: IVault) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const contractFunctionName = vault.version === "v1" ? "withdraw" : "withdrawAndClaim";
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

  const withdrawAndClaim = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: contractFunctionName,
    chainId: vault.chainId,
  });

  const { data: res, isError } = useContractRead({
    address: vault.version === "v1" ? vault.master.address : undefined,
    abi: HATSVaultV1_abi as any,
    functionName: "poolInfo",
    chainId: vault.chainId,
    scopeKey: "hats",
    args: [vault.pid],
  });
  const poolInfoData = res as any;

  return {
    ...withdrawAndClaim,
    /**
     * Call the withdrawAndClaim function.
     * @param amountInTokens - The amount in TOKENS (not shares) to withdraw
     */
    send: async (amountInTokens: BigNumber) => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      if (vault?.version === "v2") {
        // [params]: assets (amount in tokens), receiver, owner
        return withdrawAndClaim.write!({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] });
      } else {
        const totalShares: BigNumber | undefined = poolInfoData?.totalUsersAmount;
        const totalBalance: BigNumber | undefined = poolInfoData?.balance;
        let amountInShares: BigNumber = BigNumber.from(0);

        if (totalShares && totalBalance && amountInTokens && !isError) {
          if (!totalShares.eq(0)) {
            amountInShares = amountInTokens?.mul(totalShares).div(totalBalance);
          }
        }

        // [params]: pid, shares (amount in shares)
        return withdrawAndClaim.write!({ recklesslySetUnpreparedArgs: [vault.pid, amountInShares] });
      }
    },
  };
}

/**
 * Returns a caller function to request a withdraw from the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to request a withdraw from
 */
export function useWithdrawRequest(vault: IVault) {
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

  const withdrawRequest = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: "withdrawRequest",
    chainId: vault.chainId,
  });

  return {
    ...withdrawRequest,
    send: async () => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      if (vault?.version === "v2") {
        // [params]: none
        return withdrawRequest.write!();
      } else {
        // [params]: pid
        return withdrawRequest.write!({ recklesslySetUnpreparedArgs: [vault.pid] });
      }
    },
  };
}

/**
 * Returns a caller function to claim the user's rewards from the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults. For v2 vaults, we are using the rewardController.
 *
 * @param vault - The selected vault to claim the user's rewards from
 */
export function useClaimReward(vault: IVault) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.rewardController.id;
  const abi = vault.version === "v1" ? HATSVaultV1_abi : RewardController_abi;

  const claimReward = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: abi as any,
    functionName: "claimReward",
    chainId: vault.chainId,
  });

  return {
    ...claimReward,
    send: async () => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      if (vault?.version === "v2") {
        // [params]: vault, user
        return claimReward.write!({ recklesslySetUnpreparedArgs: [vault.id, account] });
      } else {
        // [params]: pid
        return claimReward.write!({ recklesslySetUnpreparedArgs: [vault.pid] });
      }
    },
  };
}

/**
 * Returns a caller function to checkin the committee to the vault
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to checkin the committee to
 */
export function useCommitteeCheckIn(vault: IVault) {
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

  const committeeCheckIn = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: "committeeCheckIn",
    chainId: vault.chainId,
  });

  return {
    ...committeeCheckIn,
    send: async () => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      if (vault?.version === "v2") {
        // [params]: none
        return committeeCheckIn.write!();
      } else {
        // [params]: pid
        return committeeCheckIn.write!({ recklesslySetUnpreparedArgs: [vault.pid] });
      }
    },
  };
}

/**
 * Returns a caller function to log a claim on the registry
 *
 * @remarks
 * This method is supporting v1 and v2 vaults. In both version the logClaim function is
 * inside the registry
 *
 * @param vault - The selected vault to send the claim
 */
export function useClaim(vault?: IVault) {
  const { chain } = useNetwork();

  const contractAddress = vault?.master.address ?? "";
  const registryAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultsRegistry_abi;
  const method = vault?.version === "v1" ? "claim" : "logClaim";

  const claim = useContractWrite({
    mode: "recklesslyUnprepared",
    address: vault ? contractAddress : undefined,
    abi: registryAbi as any,
    functionName: method,
    chainId: vault?.chainId,
  });

  return {
    ...claim,
    send: async (data: string) => {
      if (!vault) return;
      await switchNetworkAndValidate(chain!.id, vault!.chainId as number);

      return claim.write!({ recklesslySetUnpreparedArgs: [data] });
    },
  };
}
