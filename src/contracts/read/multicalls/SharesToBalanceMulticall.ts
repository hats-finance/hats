import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useContractReads } from "wagmi";
import { SharesToBalancePerVaultContract } from "../SharesToBalancePerVault";

/**
 * This is a multicall with [userBalanceAvailable, totalBalanceAvailable]. Used mainly on Deposit/Withdraw page.
 */
export class SharesToBalanceMulticall {
  static hook = (selectedVault: IVault, userShares?: BigNumber, totalShares?: BigNumber) => {
    const isTabFocused = useTabFocus();

    const { data: res, isError } = useContractReads({
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
      contracts: [
        SharesToBalancePerVaultContract.contractInfo(selectedVault, userShares),
        SharesToBalancePerVaultContract.contractInfo(selectedVault, totalShares),
      ],
    });
    const data = res as any;

    return !isError && data
      ? {
          userBalanceAvailable: SharesToBalancePerVaultContract.mapResponseToData({ data: data[0] }, selectedVault, userShares),
          totalBalanceAvailable: SharesToBalancePerVaultContract.mapResponseToData({ data: data[1] }, selectedVault, totalShares),
        }
      : {};
  };
}
