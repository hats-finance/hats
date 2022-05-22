import { useQuery } from "@apollo/client";
import { useTransactions } from "@usedapp/core";
import {
  updateRewardsToken,
  updateTokenPrices,
  updateVaults,
  updateWithdrawSafetyPeriod
} from "actions";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_MASTER_DATA, GET_VAULTS } from "graphql/subgraph";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { getTokensPrices, getWithdrawSafetyPeriod } from "utils";

export function useVaults() {
  const dispatch = useDispatch();
  const { data: vaultsData } = useQuery(GET_VAULTS, { pollInterval: 10000 });
  const { data: masterData } = useQuery(GET_MASTER_DATA);
  const { vaults, tokenPrices } = useSelector(
    (state: RootState) => state.dataReducer
  );

  const currentTransaction = useTransactions().transactions.find(tx => !tx.receipt);

  useEffect(() => {
    if (masterData) {
      const { rewardsToken, withdrawPeriod, safetyPeriod } = masterData.masters[0];
      dispatch(updateRewardsToken(rewardsToken));
      dispatch(
        updateWithdrawSafetyPeriod(
          getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)
        )
      );
      //dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)));
    }
  }, [masterData, dispatch]);

  const getVaults = useCallback(async () => {
    if (vaultsData) {
      dispatch(
        updateVaults(
          (vaultsData.vaults as IVault[]).map((vault) => ({
            ...vault,
            parentVault: {
              ...vault.parentVault,
              stakingToken: PROTECTED_TOKENS.hasOwnProperty(
                vault.parentVault.stakingToken
              )
                ? PROTECTED_TOKENS[vault.parentVault.stakingToken]
                : vault.parentVault.stakingToken
            },
            description: JSON.parse(vault.description as string),
            parentDescription: vault.parentDescription
              ? JSON.parse(vault.parentDescription as string)
              : undefined
          }))
        )
      );
    }
  }, [vaultsData, dispatch]);

  const getPrices = useCallback(async () => {
    if (vaults) {
      const stakingTokens = vaults?.map(
        (vault) => vault.parentVault.stakingToken
      );
      const uniqueTokens = Array.from(new Set(stakingTokens!));
      const tokenPrices = await getTokensPrices(uniqueTokens!);

      if (tokenPrices) {
        dispatch(updateTokenPrices(tokenPrices));
        dispatch(
          updateVaults(
            vaults.map((vault) => {
              const prices = tokenPrices[vault.parentVault.stakingToken];
              const tokenPrice = prices ? prices["usd"] : undefined;
              return {
                ...vault,
                parentVault: { ...vault.parentVault, tokenPrice }
              };
            })
          )
        );
      }
    }
  }, [vaults, dispatch]);

  useEffect(() => {
    if (vaults && Object.keys(tokenPrices).length === 0) {
      getPrices();
    }
  }, [vaults, tokenPrices, getPrices]);

  useEffect(() => {
    if (currentTransaction == null) {
      getVaults()
    }
  }, [currentTransaction, getVaults]);

  return { vaults, getVaults };
}
