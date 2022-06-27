import { useApolloClient, useQuery } from "@apollo/client";
import { useEthers } from "@usedapp/core";
import {
  updateRewardsToken,
  updateTokenPrices,
  updateVaults,
  updateWithdrawSafetyPeriod
} from "actions";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_MASTER_DATA, GET_VAULTS } from "graphql/subgraph";
import { GET_PRICES } from "graphql/uniswap";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducers";
import { POLL_INTERVAL } from "settings";
import { CoinGeckoPriceResponse, IVault, IVaultDescription } from "types/types";
import { getTokensPrices, getWithdrawSafetyPeriod, ipfsTransformUri } from "utils";

export function useVaults() {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const { chainId } = useEthers();
  const {
    refetch: refetchVaults,
    data: vaultsData } = useQuery<{ vaults: IVault[] }>(
      GET_VAULTS,
      {
        fetchPolicy: "no-cache",
        context: {
          chainId
        },
        pollInterval: POLL_INTERVAL
      });
  const { refetch: refetchMaster, data: masterData } = useQuery(GET_MASTER_DATA, {
    fetchPolicy: "no-cache",
    context: { chainId }
  });
  const { vaults } = useSelector((state: RootState) => state.dataReducer);

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
    const loadVaultDescription = async (vault: IVault): Promise<IVaultDescription | undefined> => {
      if (vault.descriptionHash && vault.descriptionHash !== "") {
        try {
          const dataResponse = await fetch(ipfsTransformUri(vault.descriptionHash)!)
          const object = await dataResponse.json()
          return fixObject(object)
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }
      return undefined;
    }

    if (vaultsData) {
      const vaultsWithData = await Promise.all(
        (vaultsData.vaults).map(async (vault) => ({
          ...vault,
          stakingToken: PROTECTED_TOKENS.hasOwnProperty(vault.stakingToken) ?
            PROTECTED_TOKENS[vault.stakingToken]
            : vault.stakingToken,
          description: await loadVaultDescription(vault)
        })));

      // TODO: TEMPORARY - mock one vault with multiple tokens based on other vaults as additional vaults
      console.log(vaultsWithData[11]);
      vaultsWithData[1].multipleVaults = [vaultsWithData[1], vaultsWithData[12], vaultsWithData[3], vaultsWithData[4], vaultsWithData[5]];
      if (vaultsWithData[1].description) {
        vaultsWithData[1].description["additional-vaults"] = [vaultsWithData[1].pid, vaultsWithData[11].pid, vaultsWithData[3].pid, vaultsWithData[4].pid, vaultsWithData[5].pid];
      }

      dispatch(updateVaults(vaultsWithData));
    }
  }, [vaultsData, dispatch]);

  const getPrices = useCallback(async () => {
    if (vaults) {
      const stakingTokens = Array.from(new Set(vaults?.map(
        (vault) => vault.stakingToken
      )));
      const tokenPrices = {};
      try {
        const coinGeckoTokenPrices = await getTokensPrices(stakingTokens!) as CoinGeckoPriceResponse;
        if (coinGeckoTokenPrices) {
          stakingTokens?.forEach((token) => {
            if (coinGeckoTokenPrices.hasOwnProperty(token)) {
              const price = coinGeckoTokenPrices?.[token]?.['usd'];

              if (price > 0) {
                tokenPrices[token] = price;
              }
            }
          })
        }
      } catch (error) {
        console.error(error);
      }

      // get all tokens that are still without prices
      const missingTokens = stakingTokens?.filter((token) => !tokenPrices.hasOwnProperty(token));
      if (missingTokens && missingTokens.length > 0) {
        const uniswapPrices = await apolloClient.query({ query: GET_PRICES, variables: { tokens: missingTokens } }) as { data: { tokens: { id, name, tokenDayData: { priceUSD: number[] } }[] } };
        uniswapPrices.data.tokens.forEach(tokenData => {
          const price = tokenData.tokenDayData[0].priceUSD;
          if (price > 0) {
            tokenPrices[tokenData.id] = price;
          }
        });
      }

      dispatch(updateTokenPrices(tokenPrices));
    }
  }, [vaults, dispatch, apolloClient]);

  useEffect(() => {
    if (vaults) {
      getPrices();
    }
  }, [vaults, getPrices, chainId]);

  useEffect(() => {
    refetchMaster({ context: { chainId } });
    refetchVaults({ context: { chainId } });
  }, [chainId, refetchMaster, refetchVaults]);

  useEffect(() => {
    getVaults()
  }, [getVaults, vaultsData]);

  return { vaults, getVaults };
}

export const fixObject = (description: any): IVaultDescription => {
  if ("Project-metadata" in description) {
    description["project-metadata"] = description["Project-metadata"]
    delete description["Project-metadata"]
  }
  return description;
}
