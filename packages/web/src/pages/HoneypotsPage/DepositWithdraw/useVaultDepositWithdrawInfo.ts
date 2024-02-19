import { MINIMUM_DEPOSIT } from "constants/constants";
import { DepositWithdrawDataMulticall, SharesToBalanceMulticall } from "contracts";
import { BigNumber } from "ethers";
import { useDepositTokens } from "hooks/nft/useDepositTokens";
import { useVaultRegisteredNft } from "hooks/nft/useVaultRegistered";
import { useTokenBalanceAmount } from "hooks/wagmi";
import { IVault } from "types";
import { Amount } from "utils/amounts.utils";
import { useAccount } from "wagmi";

/**
 * This hook will fetch all the data needed for the deposit/withdraw page. In total we have to read 5 different contracts:
 *   1. Token allowance: to check if the user has approved the vault to spend his tokens.
 *   2. Token balance: to check how many staking tokens the user has in his wallet. (Tokens the user can deposit)
 *   3. User shares: to check how many shares the user has in the vault. (Shares the user can witdraw)
 *   4. User balance: value in tokens of the user shares. (In order to calculate this we need to call the user shares contract first)
 *   5. Pending reward: to check how many pending rewards the user has in the vault.
 *   6. Total shares: to check how many shares the vault has in total.
 *   7. Total balance: value in tokens of the total shares.
 *
 * This method wont call all the contracts separately. The method is going to make three executions:
 *   1. Multicall with [tokenAllowance(1.), userShares(3.), pendingReward(5.), totalShares(6.)].
 *   2. Single call with [tokenBalance(2.)].
 *   3. Multicall with [userBalance(4.), totalBalance(7.)].
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

  const isUserCommittee = selectedVault.committee.toLowerCase() === account?.toLowerCase();
  const committeeCheckedIn = selectedVault.committeeCheckedIn;
  const minimumDeposit = BigNumber.from(MINIMUM_DEPOSIT);

  const { tokenAllowance, userSharesAvailable, totalSharesAvailable, tierFromShares } =
    DepositWithdrawDataMulticall.hook(selectedVault); // Step (1.)
  const tokenBalanceAmount = useTokenBalanceAmount({ token: vaultToken, address: account, chainId: selectedVault.chainId }); // Step (2.)
  const { userBalanceAvailable, totalBalanceAvailable } = SharesToBalanceMulticall.hook(
    selectedVault,
    userSharesAvailable,
    totalSharesAvailable
  ); // Step (3.)

  const { isUserInQueueToWithdraw, isUserInTimeToWithdraw, withdrawStartTime, withdrawEndTime } =
    getVaultWithdrawTime(selectedVault);

  const vaultNftRegistered = useVaultRegisteredNft(selectedVault);
  const { availableNftsByDeposit, redeem } = useDepositTokens(selectedVault, vaultNftRegistered, tierFromShares, account);

  return {
    depositPaused: selectedVault.depositPause,
    tokenAllowance,
    tokenBalance: tokenBalanceAmount,
    availableSharesToWithdraw: new Amount(userSharesAvailable, vaultTokenDecimals, "SHARES"),
    availableBalanceToWithdraw: new Amount(userBalanceAvailable, vaultTokenDecimals, vaultTokenSymbol),
    minimumDeposit: new Amount(minimumDeposit, vaultTokenDecimals, vaultTokenSymbol),
    isUserInQueueToWithdraw,
    isUserInTimeToWithdraw,
    withdrawStartTime,
    withdrawEndTime,
    userIsCommitteeAndCanCheckIn: isUserCommittee && !committeeCheckedIn,
    committeeCheckedIn,
    userSharesAvailable,
    totalSharesAvailable,
    totalBalanceAvailable,
    tierFromShares,
    availableNftsByDeposit,
    vaultNftRegistered,
    redeem,
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
