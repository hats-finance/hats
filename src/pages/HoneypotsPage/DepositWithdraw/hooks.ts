import { useAccount } from "wagmi";
import { BigNumber } from "ethers";
import { useTokenBalanceAmount } from "hooks/wagmi";
import { IVault } from "types/types";
import { MINIMUM_DEPOSIT, HAT_TOKEN_DECIMALS_V1, HAT_TOKEN_SYMBOL_V1 } from "constants/constants";
import { Amount } from "utils/amounts.utils";
import { TokenAllowanceContract } from "contracts/read/TokenAllowance";
import { PendingRewardContract } from "contracts/read/PendingReward";
import { UserSharesAndBalancePerVaultContract } from "contracts/read/UserSharesAndBalancePerVault";

/**
 * This hook will fetch all the data needed for the deposit/withdraw page. In total we have to read 5 different contracts:
 *   1. Token allowance: to check if the user has approved the vault to spend his tokens.
 *   2. Token balance: to check how many staking tokens the user has in his wallet. (Tokens the user can deposit)
 *   3. User shares: to check how many shares the user has in the vault. (Shares the user can witdraw)
 *   4. User balance: value in tokens of the user shares. (In order to calculate this we need to call the user shares contract first)
 *   5. Pending reward: to check how many pending rewards the user has in the vault.
 *
 * This method wont call all the contracts separately. The method is going to make three executions:
 *   1. Multicall with [tokenAllowance(1.), userShares(3.), pendingReward(5.)].
 *   2. Single call with [userBalance(4.)].
 *   3. Single call with [tokenBalance(2.)].
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to get the user shares from and the balance of those shares
 * @returns The user shares amount and the user balance
 */

export const useVaultDepositWithdrawInfo = (selectedVault: IVault) => {
  const { address: account } = useAccount();

  // Token user wants to deposit/withdraw
  const vaultToken = selectedVault.stakingToken;
  const vaultTokenDecimals = selectedVault.stakingTokenDecimals;
  const vaultTokenSymbol = selectedVault.stakingTokenSymbol;
  // Reward token
  const rewardTokenDecimals =
    selectedVault.version === "v1" ? HAT_TOKEN_DECIMALS_V1 : selectedVault.rewardController.rewardTokenDecimals;
  const rewardTokenSymbol =
    selectedVault.version === "v1" ? HAT_TOKEN_SYMBOL_V1 : selectedVault.rewardController.rewardTokenSymbol;
  // If v1 -> master address, if v2 -> vault id (contract address)
  const contractAddress = selectedVault.version === "v1" ? selectedVault.master.address : selectedVault.id;

  const tokenAllowance = TokenAllowanceContract.hook(vaultToken, account, contractAddress, { chainId: selectedVault.chainId }); // PUT INSIDE MULTI_CALL
  const pendingReward = PendingRewardContract.hook(selectedVault); // PUT INSIDE MULTI_CALL
  const isUserCommittee = selectedVault.committee.toLowerCase() === account?.toLowerCase();
  const committeeCheckedIn = selectedVault.committeeCheckedIn;
  const minimumDeposit = BigNumber.from(MINIMUM_DEPOSIT);

  const { userSharesAvailable, userBalanceAvailable } = UserSharesAndBalancePerVaultContract.hook(selectedVault); // Step (2.)
  const tokenBalanceAmount = useTokenBalanceAmount({ token: vaultToken, address: account, chainId: selectedVault.chainId }); // Step (3.)

  const { isUserInQueueToWithdraw, isUserInTimeToWithdraw, withdrawStartTime, withdrawEndTime } =
    getVaultWithdrawTime(selectedVault);

  return {
    depositPaused: selectedVault.depositPause,
    tokenAllowance,
    tokenBalance: tokenBalanceAmount,
    pendingReward: new Amount(pendingReward, rewardTokenDecimals, rewardTokenSymbol),
    availableSharesToWithdraw: new Amount(userSharesAvailable, vaultTokenDecimals, "SHARES"),
    availableBalanceToWithdraw: new Amount(userBalanceAvailable, vaultTokenDecimals, vaultTokenSymbol),
    minimumDeposit: new Amount(minimumDeposit, vaultTokenDecimals, vaultTokenSymbol),
    isUserInQueueToWithdraw,
    isUserInTimeToWithdraw,
    withdrawStartTime,
    withdrawEndTime,
    userIsCommitteeAndCanCheckIn: isUserCommittee && !committeeCheckedIn,
    committeeCheckedIn,
  };
};

export const getVaultWithdrawTime = (selectedVault: IVault) => {
  // Amount of time the user has to withdraw the funds
  const withdrawEnabledPeriod = +selectedVault.master.withdrawRequestEnablePeriod;

  let withdrawStartTime = selectedVault.userWithdrawRequest?.[0]?.withdrawEnableTime;
  withdrawStartTime = withdrawStartTime ? +withdrawStartTime : undefined;

  const withdrawEndTime = withdrawStartTime ? withdrawStartTime + withdrawEnabledPeriod : undefined;
  const nowInSeconds = Date.now() / 1000;
  const isUserInQueueToWithdraw = nowInSeconds < (withdrawStartTime ?? 0);
  const isUserInTimeToWithdraw =
    withdrawStartTime && withdrawEndTime ? nowInSeconds > withdrawStartTime && nowInSeconds < withdrawEndTime : false;

  return {
    isUserInQueueToWithdraw,
    isUserInTimeToWithdraw,
    withdrawStartTime,
    withdrawEndTime,
  };
};
