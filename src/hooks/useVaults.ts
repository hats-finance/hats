import { useApolloClient } from "@apollo/client";
import { useTransactions } from "@usedapp/core";
import {
  updateHatsPrice,
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
import { getTokenPrice, getTokensPrices, getWithdrawSafetyPeriod } from "utils";

export function useVaults() {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const { vaults, tokenPrices } = useSelector(
    (state: RootState) => state.dataReducer
  );

  const currentTransaction = useTransactions().transactions.find(tx => !tx.receipt);


  const getMasterData = useCallback(async () => {
    const { data } = await apolloClient.query({ query: GET_MASTER_DATA, fetchPolicy: 'no-cache' });
    if (data) {
      const { rewardsToken, withdrawPeriod, safetyPeriod } = data.masters[0];
      dispatch(updateRewardsToken(rewardsToken));
      dispatch(
        updateWithdrawSafetyPeriod(
          getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)
        )
      );
      dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)));
    }
  }, [apolloClient, dispatch]);

  const getVaults = useCallback(async () => {
    console.log('getVaults');
    const { data } = await apolloClient.query({ query: GET_VAULTS, fetchPolicy: 'no-cache' });
    if (data) {
      console.log('got vaults', data);
      dispatch(
        updateVaults(
          (data.vaults as IVault[]).map((vault) => ({
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
  }, [apolloClient, dispatch]);

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
    if (!vaults) {
      getVaults();
      getMasterData();
    }
  }, [vaults, getVaults, getMasterData]);

  useEffect(() => {
    if (currentTransaction == null) {
      getVaults()
    }
  }, [currentTransaction, getVaults]);

  return { vaults, getVaults };
}
