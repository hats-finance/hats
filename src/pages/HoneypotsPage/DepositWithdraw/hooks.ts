import { BigNumber } from "ethers";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { usePendingReward, useWithdrawRequestInfo, useUserSharesAndBalancePerVault } from "hooks/contractHooksCalls";
import { IVault } from "types/types";
import { MINIMUM_DEPOSIT, HAT_TOKEN_DECIMALS_V1, HAT_TOKEN_SYMBOL_V1 } from "constants/constants";
import { Amount } from "utils/amounts.utils";

export const useVaultDepositWithdrawInfo = (selectedVault: IVault) => {
  const { account } = useEthers();

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
  // Amount of time the user has to withdraw the funds
  const withdrawWindowTime = selectedVault.master.withdrawRequestEnablePeriod;

  const tokenAllowanceAmount = useTokenAllowance(vaultToken, account, contractAddress);
  const tokenBalance = useTokenBalance(vaultToken, account);
  const { userSharesAvailable, userBalanceAvailable } = useUserSharesAndBalancePerVault(selectedVault);
  const pendingReward = usePendingReward(contractAddress, contractAddress, account); // TODO:[v2] implement reward controller address
  const withdrawStartTime = useWithdrawRequestInfo(contractAddress, selectedVault, account); // TODO:[v2] implement this.
  const now = Date.now();
  const isUserInQueueToWithdraw = now < (withdrawStartTime?.toNumber() ?? 0);
  const isUserOnTimeToWithdraw =
    withdrawStartTime && withdrawWindowTime
      ? now > withdrawStartTime.toNumber() &&
        now < withdrawStartTime.toNumber() + BigNumber.from(withdrawWindowTime).toNumber() * 1000
      : false;
  const isUserCommittee = selectedVault.committee.toLowerCase() === account?.toLowerCase();
  const committeeCheckedIn = selectedVault.committeeCheckedIn;
  const minimumDeposit = BigNumber.from(MINIMUM_DEPOSIT);

  return {
    tokenAllowanceAmount,
    tokenBalance: new Amount(tokenBalance, vaultTokenDecimals, vaultTokenSymbol),
    pendingReward: new Amount(pendingReward, rewardTokenDecimals, rewardTokenSymbol),
    availableSharesToWithdraw: new Amount(userSharesAvailable, vaultTokenDecimals, "SHARES"),
    availableBalanceToWithdraw: new Amount(userBalanceAvailable, vaultTokenDecimals, vaultTokenSymbol),
    minimumDeposit: new Amount(minimumDeposit, vaultTokenDecimals, vaultTokenSymbol),
    isUserInQueueToWithdraw,
    isUserOnTimeToWithdraw,
    committeeCheckedIn,
    userIsCommitteeAndCanCheckIn: isUserCommittee && !committeeCheckedIn,
  };
};
