import { IVault } from "@hats-finance/shared";
import { UserSharesPerVaultContract } from "contracts";
import { BigNumber } from "ethers";
import { useAccount, useContractReads } from "wagmi";

export const useHasUserDepositedAmount = (vaults: IVault[]) => {
  const { address } = useAccount();

  const contractsInfo = vaults.map((vault) => UserSharesPerVaultContract.contractInfo(vault, address));
  const call = useContractReads({
    contracts: contractsInfo as any,
    enabled: !!address,
  });

  if (!address) return false;
  return (call.data && call.data?.some((amount) => BigNumber.from(amount).gt(0))) ?? false;
};
