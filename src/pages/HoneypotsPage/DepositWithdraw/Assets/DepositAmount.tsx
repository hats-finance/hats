import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { useUserSharesPerVault } from "hooks/contractHooksCalls";
import { IVault } from "types/types";

interface IProps {
  vault: IVault;
}

export const DepositAmount = ({ vault }: IProps) => {
  const { account } = useEthers();
  const availableToWithdraw = useUserSharesPerVault(vault.master.address, vault, account!);
  const formatAvailableToWithdraw = availableToWithdraw ? formatUnits(availableToWithdraw, vault.stakingTokenDecimals) : "-";

  return <span>{formatAvailableToWithdraw}</span>;
};
