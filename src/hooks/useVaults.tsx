import { useApolloClient } from "@apollo/client";
import { useEthers } from "@usedapp/core";
import { VaultInstances } from "constants/constants";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_VAULTS } from "graphql/subgraph";
import { GET_PRICES } from "graphql/uniswap";
import { useCallback, useEffect, useState, createContext, useContext } from "react";
import { IVault, IVaultDescription } from "types/types";
import { getTokensPrices, ipfsTransformUri } from "utils";

interface IVaultsContext {
  vaults?: IVault[]
  tokenPrices?: number[]
  subscribeToVaults: Function
  removeSubscription: Function
}

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults() {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState<IVault[]>();
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [tokenPrices, setTokenPrices] = useState<number[]>();
  const apolloClient = useApolloClient();
  const { chainId } = useEthers();

  // useEffect(() => {
  //   if (masterData) {
  //     const { rewardsToken, withdrawPeriod, safetyPeriod } = masterData.masters[0];
  //     dispatch(updateRewardsToken(rewardsToken));
  //     dispatch(
  //       updateWithdrawSafetyPeriod(
  //         getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)
  //       )
  //     );
  //     //dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)));
  //   }
  // }, [masterData, dispatch]);


  const getPrices = useCallback(async (vaults: IVault[]) => {
    if (vaults) {
      const stakingTokens = Array.from(new Set(vaults?.map(
        (vault) => vault.stakingToken
      )));
      const newTokenPrices = tokenPrices || Array<number>();
      try {
        const coinGeckoTokenPrices = await getTokensPrices(stakingTokens!);
        if (coinGeckoTokenPrices) {
          stakingTokens?.forEach((token) => {
            if (coinGeckoTokenPrices.hasOwnProperty(token)) {
              const price = coinGeckoTokenPrices?.[token]?.['usd'];

              if (price > 0) {
                newTokenPrices[token] = price;
              }
            }
          })
        }
      } catch (error) {
        console.error(error);
      }

      // get all tokens that are still without prices
      const missingTokens = stakingTokens?.filter((token) => !newTokenPrices.hasOwnProperty(token));
      if (missingTokens && missingTokens.length > 0) {
        const uniswapPrices = await apolloClient.query({ query: GET_PRICES, variables: { tokens: missingTokens } }) as { data: { tokens: { id, name, tokenDayData: { priceUSD: number[] } }[] } };
        uniswapPrices.data.tokens.forEach(tokenData => {
          const price = tokenData.tokenDayData[0].priceUSD;
          if (price > 0) {
            newTokenPrices[tokenData.id] = price;
          }
        });
      }
      setTokenPrices(newTokenPrices);
    }
  }, [apolloClient, tokenPrices]);


  const getAllVaults = useCallback(async () => {

    const getVaultsFromGraph = async (chainId, version) =>
      (await apolloClient.query<{ vaults: IVault[] }>({
        query: GET_VAULTS,
        context: { chainId, version },
        fetchPolicy: "no-cache"

      })).data.vaults

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

    const getVaultsData = async (vaults: IVault[]) => Promise.all(
      vaults.map(async (vault) => ({
        ...vault,
        stakingToken: PROTECTED_TOKENS.hasOwnProperty(vault.stakingToken) ?
          PROTECTED_TOKENS[vault.stakingToken]
          : vault.stakingToken,
        description: await loadVaultDescription(vault)
      })));

    const vaultsPerVersion = await Promise.all(
      Object.keys(VaultInstances)
        .map(version => getVaultsFromGraph(chainId, version)));
    const allVaults = vaultsPerVersion.flat(); // all versions in one array
    const vaultsWithDescription = await getVaultsData(allVaults);
    setVaults(vaultsWithDescription);
    getPrices(allVaults);

  }, [setVaults, apolloClient, getPrices, chainId]);


  useEffect(() => {
    if (subscribed) {
      getAllVaults();
    }
  }, [chainId, subscribed, getAllVaults]);

  const subscribeToVaults = () => {
    setSubscribed(true);
  }

  const removeSubscription = () => {
    setSubscribed(false);
  }

  const context: IVaultsContext = {
    vaults,
    tokenPrices,
    subscribeToVaults,
    removeSubscription
  };

  return <VaultsContext.Provider value={context}>
    {children}
  </VaultsContext.Provider>
}

export const fixObject = (description: any): IVaultDescription => {
  if ("Project-metadata" in description) {
    description["project-metadata"] = description["Project-metadata"]
    delete description["Project-metadata"]
  }
  return description;
}
