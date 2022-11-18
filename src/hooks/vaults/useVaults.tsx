import { useApolloClient } from "@apollo/client";
import { useEthers } from "@usedapp/core";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_PRICES, UniswapV3GetPrices } from "graphql/uniswap";
import { tokenPriceFunctions } from "helpers/getContractPrices";
import { useCallback, useEffect, useState, createContext, useContext } from "react";
import { IMaster, IVault, IVaultDescription, IWithdrawSafetyPeriod } from "types/types";
import { getTokensPrices, ipfsTransformUri } from "utils";
import { INFTTokenData, useNFTTokenData } from "hooks/useNFTTokenData";
import { blacklistedWallets } from "data/blacklistedWallets";
import { useLiveSafetyPeriod } from "../useLiveSafetyPeriod";
import { useMultiChainVaults } from "./useMultiChainVaults";

interface IVaultsContext {
  vaults?: IVault[];
  tokenPrices?: number[];
  masters?: IMaster[];
  nftData?: INFTTokenData;
  withdrawSafetyPeriod?: IWithdrawSafetyPeriod;
}

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults() {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState<IVault[]>([]);
  const [tokenPrices, setTokenPrices] = useState<number[]>();
  const apolloClient = useApolloClient();
  const { chainId, library, account } = useEthers();
  const nftData = useNFTTokenData(account);

  if (account && blacklistedWallets.indexOf(account) !== -1) {
    throw new Error("Blacklisted wallet");
  }

  const { data } = useMultiChainVaults();

  const getPrices = useCallback(
    async (vaults: IVault[]) => {
      if (vaults && library) {
        const stakingTokens = Array.from(new Set(vaults?.map((vault) => vault.stakingToken.toLowerCase())));
        const newTokenPrices = Array<number>();
        if (library) {
          for (const token in tokenPriceFunctions) {
            const getPriceFunction = tokenPriceFunctions[token];
            if (getPriceFunction !== undefined) {
              const price = await tokenPriceFunctions[token](library);
              if (price && price > 0) newTokenPrices[token] = price;
            }
          }
        }

        try {
          // get all tokens that did not have price from contract
          const coinGeckoTokenPrices = await getTokensPrices(stakingTokens.filter((token) => !(token in newTokenPrices)));
          if (coinGeckoTokenPrices) {
            stakingTokens?.forEach((token) => {
              if (coinGeckoTokenPrices.hasOwnProperty(token)) {
                const price = coinGeckoTokenPrices?.[token]?.["usd"];
                if (price > 0) {
                  newTokenPrices[token] = price;
                }
              }
            });
          }
        } catch (error) {
          console.error(error);
        }

        // get all tokens that are still without prices
        const missingTokens = stakingTokens?.filter((token) => !newTokenPrices.hasOwnProperty(token));
        if (missingTokens && missingTokens.length > 0) {
          const uniswapPrices = (
            await apolloClient.query<UniswapV3GetPrices>({
              query: GET_PRICES,
              variables: { tokens: missingTokens },
            })
          ).data;
          uniswapPrices.tokens.forEach((tokenData) => {
            const price = tokenData.tokenDayData[0].priceUSD;
            if (price > 0) {
              newTokenPrices[tokenData.id] = price;
            }
          });
        }
        return newTokenPrices;
      }
    },
    [apolloClient, library]
  );

  const setVaultsWithDetails = async (vaultsData: IVault[]) => {
    const loadVaultDescription = async (vault: IVault): Promise<IVaultDescription | undefined> => {
      if (vault.descriptionHash && vault.descriptionHash !== "") {
        try {
          const dataResponse = await fetch(ipfsTransformUri(vault.descriptionHash)!);
          const object = await dataResponse.json();
          return fixObject(object);
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getVaultsData = async (vaults: IVault[]): Promise<IVault[]> =>
      Promise.all(
        vaults.map(async (vault) => {
          const description = (await loadVaultDescription(vault)) as IVaultDescription;

          return {
            ...vault,
            stakingToken: PROTECTED_TOKENS.hasOwnProperty(vault.stakingToken)
              ? PROTECTED_TOKENS[vault.stakingToken]
              : vault.stakingToken,
            description,
          } as IVault;
        })
      );

    const vaultsWithDescription = (await getVaultsData(vaultsData)).filter((vault) => {
      if (
        vault.description?.["project-metadata"].starttime &&
        vault.description?.["project-metadata"].starttime > Date.now() / 1000
      )
        return false;
      if (vault.description?.["project-metadata"].endtime && vault.description?.["project-metadata"].endtime < Date.now() / 1000)
        return false;
      return true;
    });

    // TODO: remove this in order to support multiple vaults again
    //const vaultsWithMultiVaults = addMultiVaults(vaultsWithDescription);
    setVaults(vaultsWithDescription);
  };

  useEffect(() => {
    let cancelled = false;
    if (vaults && chainId === 1) {
      getPrices(vaults).then((prices) => {
        if (!cancelled) setTokenPrices(prices);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [vaults, getPrices, chainId]);

  useEffect(() => {
    if (data?.vaults) setVaultsWithDetails(data?.vaults);
  }, [data]);

  const { safetyPeriod, withdrawPeriod } = data?.masters?.[0] || {};

  const withdrawSafetyPeriod = useLiveSafetyPeriod(safetyPeriod, withdrawPeriod);

  console.log(vaults);
  const context: IVaultsContext = {
    nftData,
    vaults,
    tokenPrices,
    masters: data?.masters,
    withdrawSafetyPeriod,
  };

  return <VaultsContext.Provider value={context}>{children}</VaultsContext.Provider>;
}

export const fixObject = (description: any): IVaultDescription => {
  if ("Project-metadata" in description) {
    description["project-metadata"] = description["Project-metadata"];
    delete description["Project-metadata"];
  }
  if ("gamification" in description["project-metadata"] && description["project-metadata"].gamification) {
    description["project-metadata"].type = "gamification";
  }
  return description;
};

// const addMultiVaults = (vaults: IVault[]) =>
//   vaults.map((vault) => {
//     const additionalVaults = vault.description?.["additional-vaults"] ?? [];
//     const vaultsIds = Array.isArray(additionalVaults) ? additionalVaults : [additionalVaults];

//     return vault.description?.["additional-vaults"]
//       ? {
//         ...vault,
//         multipleVaults: [vault, ...fetchVaultsByIds(vaults, vaultsIds)],
//       }
//       : vault;
//   });

// const fetchVaultsByIds = (vaults: IVault[], ids: string[]) =>
//   ids.map((id) => vaults.find((vault) => vault.id === id)).filter((vault) => vault) as IVault[];
