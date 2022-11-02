import { BigNumber, BigNumberish } from "ethers";
import millify from "millify";
import { formatEther, formatUnits } from "@ethersproject/units";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { usePendingReward, useUserSharesPerVault, useWithdrawRequestInfo } from "hooks/contractHooksCalls";
import { IVault } from "types/types";
import { isDateBefore, isDateBetween } from "utils";
import { MINIMUM_DEPOSIT } from "constants/constants";

export const useVaultDepositWithdrawInfo = (mainVault: IVault, selectedVault: IVault) => {
  const { account } = useEthers();

  // Token user wants to deposit/withdraw
  const vaultToken = selectedVault.stakingToken;
  const vaultTokenDecimals = selectedVault.stakingTokenDecimals;
  const vaultTokenSymbol = selectedVault.stakingTokenSymbol;
  // If v1 -> master address, if v2 -> vault id (contract address)
  const contractAddress = selectedVault.version === "v1" ? mainVault.master.address : selectedVault.id;
  // Amount of time the user has to withdraw the funds
  const withdrawWindowTime = mainVault.master.withdrawRequestEnablePeriod;

  const tokenAllowanceAmount = useTokenAllowance(vaultToken, account, contractAddress);
  const tokenBalance = useTokenBalance(vaultToken, account);
  const pendingReward = usePendingReward(contractAddress, contractAddress, account); // TODO:[v2] implement reward controller address
  const availableToWithdraw = useUserSharesPerVault(contractAddress, selectedVault, account); // TODO:[v2] implement this. LP token? 1:1?
  const withdrawStartTime = useWithdrawRequestInfo(contractAddress, selectedVault, account); // TODO:[v2] implement this.
  const isUserInQueueToWithdraw = isDateBefore(withdrawStartTime?.toString());
  const isUserOnTimeToWithdraw = isDateBetween(withdrawStartTime?.toString(), withdrawWindowTime);
  const isUserCommittee = selectedVault.committee.toLowerCase() === account?.toLowerCase();
  const committeeCheckedIn = selectedVault.committeeCheckedIn;
  const minimumDeposit = BigNumber.from(MINIMUM_DEPOSIT);

  return {
    tokenAllowanceAmount,
    tokenBalance: {
      bigNumber: tokenBalance ? tokenBalance : BigNumber.from(0),
      number: tokenBalance ? Number(formatUnits(tokenBalance, vaultTokenDecimals)) : 0,
      formatted: `${tokenBalance ? formatUnits(tokenBalance, vaultTokenDecimals) : "-"} ${vaultTokenSymbol}`,
    },
    pendingReward: {
      bigNumber: pendingReward ? pendingReward : BigNumber.from(0),
      number: pendingReward ? Number(formatEther(pendingReward)) : 0,
      formatted: `${pendingReward ? millify(Number(formatEther(pendingReward)), { precision: 3 }) : "-"} HAT`, // TODO:[v2] the reward token will be always HAT?
    },
    availableToWithdraw: {
      bigNumber: availableToWithdraw ? availableToWithdraw : BigNumber.from(0),
      number: availableToWithdraw ? Number(formatUnits(availableToWithdraw, vaultTokenDecimals)) : 0,
      formatted: `${availableToWithdraw ? formatUnits(availableToWithdraw, vaultTokenDecimals) : "-"} ${vaultTokenSymbol}`,
    },
    minimumDeposit: {
      bigNumber: BigNumber.from(minimumDeposit),
      number: Number(formatUnits(minimumDeposit, vaultTokenDecimals)),
      formatted: `${formatUnits(minimumDeposit, vaultTokenDecimals)} ${vaultTokenSymbol}`,
    },
    isUserInQueueToWithdraw,
    isUserOnTimeToWithdraw,
    committeeCheckedIn,
    userIsCommitteeAndCanCheckIn: isUserCommittee && !committeeCheckedIn,
  };
};
