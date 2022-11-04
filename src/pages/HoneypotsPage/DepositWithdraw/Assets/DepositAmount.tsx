import { formatUnits } from "@ethersproject/units";
import { useUserSharesPerVault } from "hooks/contractHooksCalls";
import { IVault } from "types/types";

interface IProps {
  vault: IVault;
}

export const DepositAmount = ({ vault }: IProps) => {
  const availableToWithdraw = useUserSharesPerVault(vault);
  const formatAvailableToWithdraw = availableToWithdraw ? formatUnits(availableToWithdraw, vault.stakingTokenDecimals) : "-";

  return <span>{formatAvailableToWithdraw}</span>;
};
