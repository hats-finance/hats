import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { fromWei } from "utils";

export function useVaultsTotalPrices(vaults: IVault[]) {
  const tokensPrices = useSelector((state: RootState) => state.dataReducer.tokenPrices);
  const totalPrices: { [token: string]: number } = {};

  vaults.forEach(vault => {
    const totalUSDValue = tokensPrices[vault.stakingToken] ? tokensPrices[vault.stakingToken] * Number(fromWei(vault.honeyPotBalance, vault.stakingTokenDecimals)) : undefined;
    if (totalUSDValue) {
      totalPrices[vault.stakingToken] = totalUSDValue;
    }
  })

  return { totalPrices };
}
