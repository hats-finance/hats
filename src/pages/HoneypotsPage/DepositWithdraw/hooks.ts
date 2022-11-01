import millify from "millify";
import { formatEther, formatUnits } from "@ethersproject/units";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { usePendingReward, useUserSharesPerVault, useWithdrawRequestInfo } from "hooks/contractHooks";
import { IVault } from "types/types";
import { isDateBefore, isDateBetween } from "utils";

export const useVaultDepositWithdrawInfo = (mainVault: IVault, selectedVault: IVault) => {
  const { account } = useEthers();

  // Token user wants to deposit/withdraw
  const vaultToken = selectedVault.stakingToken;
  const vaultTokenDecimals = selectedVault.stakingToken;
  // If v1 -> master address, if v2 -> vault id (contract address)
  const contractAddress = selectedVault.version === "v1" ? mainVault.master.address : selectedVault.id;
  // Amount of time the user has to withdraw the funds
  const withdrawWindowTime = mainVault.master.withdrawRequestEnablePeriod;

  const tokenAllowanceAmount = useTokenAllowance(vaultToken, account, contractAddress);
  const tokenBalance = useTokenBalance(vaultToken, account);
  const pendingReward = usePendingReward(contractAddress, contractAddress, account); // TODO:[v2] implement reward controller address
  const availableAmountToWithdraw = useUserSharesPerVault(contractAddress, selectedVault, account); // TODO:[v2] implement this. LP token? 1:1?
  const withdrawStartTime = useWithdrawRequestInfo(contractAddress, selectedVault, account); // TODO:[v2] implement this.
  const isUserInQueueToWithdraw = isDateBefore(withdrawStartTime?.toString());
  const isUserAbleToWithdraw = isDateBetween(withdrawStartTime?.toString(), withdrawWindowTime);

  return {
    tokenAllowanceAmount,
    stakingTokenBalance: {
      bigNumber: tokenBalance,
      formatted: tokenBalance ? formatUnits(tokenBalance, vaultTokenDecimals) : "-",
    },
    pendingReward: {
      bigNumber: pendingReward,
      formatted: pendingReward ? millify(Number(formatEther(pendingReward)), { precision: 3 }) : "-",
    },
    availableAmountToWithdraw: {
      bigNumber: availableAmountToWithdraw,
      formatted: availableAmountToWithdraw ? formatUnits(availableAmountToWithdraw, vaultTokenDecimals) : "-",
    },
    isUserInQueueToWithdraw,
    isUserAbleToWithdraw,
  };
};
