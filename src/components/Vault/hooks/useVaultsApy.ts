import { useVaults } from "hooks/useVaults";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { VaultApys, IVault } from "types/types";
import { fromWei } from "utils";

export function useVaultsApy(vaults: IVault[]) {
  const { dataReducer: { hatsPrice } } = useSelector((state: RootState) => state);
  const { tokenPrices } = useVaults();
  const apys: VaultApys = {};

  vaults.forEach(vault => {
    if (!hatsPrice || !tokenPrices?.[vault.stakingToken]) {
      apys[vault.stakingToken] = { apy: undefined, tokenSymbol: vault.stakingTokenSymbol };
    } else if (Number(fromWei(vault.totalStaking)) === 0) {
      apys[vault.stakingToken] = { apy: 0, tokenSymbol: vault.stakingTokenSymbol };
    } else {
      apys[vault.stakingToken] = {
        apy: ((Number(fromWei(vault.totalRewardPaid)) * Number(hatsPrice)) / Number(fromWei(vault.totalStaking))) * tokenPrices[vault.stakingToken],
        tokenSymbol: vault.stakingTokenSymbol
      };
    }
  })

  return { apys };
}
