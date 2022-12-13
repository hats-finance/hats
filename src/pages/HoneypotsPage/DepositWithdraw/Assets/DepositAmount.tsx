import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { useUserSharesPerVault } from "hooks/contractHooks";
import { IVault } from "types/types";
import { calculateWithdrawSharesValue } from "../utils";

interface IProps {
  vault: IVault;
}

export const DepositAmount = ({ vault }: IProps) => {
  const { account } = useEthers();
  const availableSharesToWithdraw = useUserSharesPerVault(vault.master.address, vault.pid, account!);
  const availableTokensToWithdraw = calculateWithdrawSharesValue(
    availableSharesToWithdraw,
    BigNumber.from(vault.honeyPotBalance),
    BigNumber.from(vault.totalUsersShares)
  );

  const formatAvailableToWithdraw = availableTokensToWithdraw
    ? formatUnits(availableTokensToWithdraw, vault.stakingTokenDecimals)
    : "-";

  return <span>{formatAvailableToWithdraw}</span>;
};
