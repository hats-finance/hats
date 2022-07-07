import { useApolloClient } from "@apollo/client";
import { useEthers, useTransactions } from "@usedapp/core";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_VAULTS } from "graphql/subgraph";
import { GET_PRICES, UniswapV3GetPrices } from "graphql/uniswap";
import { usePrevious } from "hooks/usePrevious";
import { useCallback, useEffect, useState, createContext, useContext } from "react";
import { IMaster, IVault, IVaultDescription } from "types/types";
import { getTokensPrices, ipfsTransformUri } from "utils";

interface IVaultsContext {
  vaults?: IVault[]
  tokenPrices?: number[]
  generalParameters?: IMaster
  subscribeToVaults: Function
  removeSubscription: Function
  refresh: Function;
}

const DATA_REFRESH_TIME = 10000;

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults() {
  // every place useVaults is used we subscribed and remove subscription upon unmounting.
  // this should not create any overhead 
  const vaultsContext = useContext(VaultsContext);
  useEffect(() => {
    vaultsContext.subscribeToVaults();
    return () => {
      vaultsContext.removeSubscription();
    }
  }, [vaultsContext])
  return vaultsContext
}

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState<IVault[]>();
  const [subscriptions, setSubscrptions] = useState<number>(0)
  const prevSubscriptions = usePrevious(subscriptions);
  const [tokenPrices, setTokenPrices] = useState<number[]>();
  const apolloClient = useApolloClient();
  const { chainId } = useEthers();
  const prevChainId = usePrevious(chainId);
  const { transactions } = useTransactions();
  const prevTransactions = usePrevious(transactions);

  const getPrices = useCallback(async (vaults: IVault[]) => {
    if (vaults) {
      const stakingTokens = Array.from(new Set(vaults?.map(
        (vault) => vault.stakingToken
      )));
      const newTokenPrices = Array<number>();
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
        const uniswapPrices = (await apolloClient.query<UniswapV3GetPrices>({
          query: GET_PRICES,
          variables: { tokens: missingTokens }
        })).data;
        uniswapPrices.tokens.forEach(tokenData => {
          const price = tokenData.tokenDayData[0].priceUSD;
          if (price > 0) {
            newTokenPrices[tokenData.id] = price;
          }
        });
      }
      return newTokenPrices;
    }
  }, [apolloClient]);

  const getVaults = useCallback(async () => {
    const getVaultsFromGraph = async (chainId) =>
      (await apolloClient.query<{ vaults: IVault[] }>({
        query: GET_VAULTS,
        variables: { chainId },
        context: { chainId },
        fetchPolicy: "network-only",
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

    const vaults = await getVaultsFromGraph(chainId);
    const vaultsWithDescription = await getVaultsData(vaults);
    return addMultiVaults(vaultsWithDescription);

  }, [apolloClient, chainId]);


  useEffect(() => {
    let cancelled = false;
    if (vaults)
      getPrices(vaults)
        .then((prices) => {
          if (!cancelled) {
            setTokenPrices(prices)
          }
        })
    return () => {
      cancelled = true;
    }
  }, [vaults, getPrices, chainId])

  useEffect(() => {
    console.log({subscriptions, prevChainId, chainId, prevSubscriptions})
    let cancelled = false;
    if ((subscriptions && prevSubscriptions === 0) || (chainId !== prevChainId && prevChainId)) {
      getVaults().then(vaults => {
        if (!cancelled && vaults) {
          console.log({vaults});
          setVaults(vaults);
        }
      });
    }
    return () => {
      cancelled = true;
    }
  }, [chainId, subscriptions, prevSubscriptions, prevChainId, getVaults]);

  const refresh = useCallback(() => {
    getVaults().then(vaults => {
      setVaults(vaults);
    })
  }, [getVaults])

  useEffect(() => {
    const currentTransaction = transactions?.find(tx => !tx.receipt);
    const prevCurrentTransaction = prevTransactions?.find(tx => !tx.receipt);

    if (!currentTransaction && currentTransaction !== prevCurrentTransaction && subscriptions !== 0) {
      setTimeout(refresh, DATA_REFRESH_TIME);
    }
  }, [transactions, prevTransactions, refresh, subscriptions])

  const subscribeToVaults = () => {
    setSubscrptions(subscriptions => subscriptions + 1);
  }

  const removeSubscription = () => {
    setSubscrptions(subscriptions => subscriptions - 1);
  }

  const context: IVaultsContext = {
    vaults,
    tokenPrices,
    generalParameters: vaults?.[0].master,
    subscribeToVaults,
    removeSubscription,
    refresh
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
  if ('gamification' in description["project-metadata"] &&
    description["project-metadata"].gamification) {
    description["project-metadata"].type = 'gamification';
  }
  return description;
}

const addMultiVaults = (vaults: IVault[]) =>
  vaults.map(vault => vault.description?.["additional-vaults"] ?
    {
      ...vault,
      multipleVaults: [vault, ...fetchVaultsByPids(vaults, vault.description["additional-vaults"])]
    }
    : vault);

const fetchVaultsByPids = (vaults: IVault[], pids: string[]) => (
  pids.map(pid => vaults.find(vault => vault.pid === pid)).filter(vault => vault) as IVault[]
)
