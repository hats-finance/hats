import { useApolloClient } from "@apollo/client";
import { useAccount, useNetwork } from "wagmi";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_PRICES, UniswapV3GetPrices } from "graphql/uniswap";
import { tokenPriceFunctions } from "helpers/getContractPrices";
import { useCallback, useEffect, useState, createContext, useContext } from "react";
import { IMaster, IUserNft, IVault, IVaultDescription, IWithdrawSafetyPeriod } from "types";
import { getTokensPrices, ipfsTransformUri } from "utils";
import { blacklistedWallets } from "data/blacklistedWallets";
import { useLiveSafetyPeriod } from "../useLiveSafetyPeriod";
import { useMultiChainVaults } from "./useMultiChainVaults";
import { INFTTokenMetadata } from "hooks/nft/types";
import { fixObject } from "@hats-finance/shared";

interface IVaultsContext {
  vaults?: IVault[];
  tokenPrices?: number[];
  masters?: IMaster[];
  userNfts?: IUserNft[];
  withdrawSafetyPeriod?: IWithdrawSafetyPeriod;
}

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults() {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }) {
  const [vaults, setVaults] = useState<IVault[]>([]);
  const [allVaults, setAllVaults] = useState<IVault[]>([]);
  const [userNfts, setUserNfts] = useState<IUserNft[]>([]);
  const [tokenPrices, setTokenPrices] = useState<number[]>();
  const apolloClient = useApolloClient();
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  if (account && blacklistedWallets.indexOf(account) !== -1) {
    throw new Error("Blacklisted wallet");
  }

  const { data, networkEnv } = useMultiChainVaults();

  const getPrices = useCallback(
    async (vaults: IVault[]) => {
      if (vaults) {
        const stakingTokens = vaults?.map((vault) => ({
          address: vault.stakingToken.toLowerCase(),
          chain: vault.chainId as number,
        }));

        const newTokenPrices = Array<number>();
        for (const token in tokenPriceFunctions) {
          const getPriceFunction = tokenPriceFunctions[token];
          if (getPriceFunction !== undefined) {
            const price = await getPriceFunction();
            if (price && price > 0) newTokenPrices[token] = price;
          }
        }

        try {
          // get all tokens that did not have price from contract
          const coinGeckoTokenPrices = await getTokensPrices(stakingTokens.filter((token) => !(token.address in newTokenPrices)));
          if (coinGeckoTokenPrices) {
            stakingTokens?.forEach((token) => {
              if (coinGeckoTokenPrices.hasOwnProperty(token.address)) {
                const price = coinGeckoTokenPrices?.[token.address]?.["usd"];
                if (price > 0) {
                  newTokenPrices[token.address] = price;
                }
              }
            });
          }
        } catch (error) {
          console.error(error);
        }

        // get all tokens that are still without prices
        const missingTokens = stakingTokens.filter((token) => !(token.address in newTokenPrices)).map((token) => token.address);
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
    [apolloClient]
  );

  const setVaultsWithDetails = async (vaultsData: IVault[]) => {
    const loadVaultDescription = async (vault: IVault): Promise<IVaultDescription | undefined> => {
      if (vault.descriptionHash && vault.descriptionHash !== "") {
        try {
          const dataResponse = await fetch(ipfsTransformUri(vault.descriptionHash)!);
          if (dataResponse.status === 200) {
            const object = await dataResponse.json();
            return fixObject(object);
          }
          return undefined;
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getVaultsData = async (vaultsToFetch: IVault[]): Promise<IVault[]> =>
      Promise.all(
        vaultsToFetch.map(async (vault) => {
          const existsDescription = allVaults.find((v) => v.id === vault.id)?.description;
          const description = existsDescription ?? ((await loadVaultDescription(vault)) as IVaultDescription);

          return {
            ...vault,
            stakingToken: PROTECTED_TOKENS.hasOwnProperty(vault.stakingToken)
              ? PROTECTED_TOKENS[vault.stakingToken]
              : vault.stakingToken,
            description,
          } as IVault;
        })
      );

    const allVaultsData = await getVaultsData(vaultsData);

    const vaultsWithDescription = allVaultsData.filter((vault) => {
      if (
        vault.description?.["project-metadata"].starttime &&
        vault.description?.["project-metadata"].starttime > Date.now() / 1000
      )
        return false;
      if (vault.description?.["project-metadata"].endtime && vault.description?.["project-metadata"].endtime < Date.now() / 1000)
        return false;
      return true;
    });

    setAllVaults(allVaultsData);
    // TODO: remove this in order to support multiple vaults again
    //const vaultsWithMultiVaults = addMultiVaults(vaultsWithDescription);
    setVaults(vaultsWithDescription);
  };

  const setUserNftsWithMetadata = async (userNftsData: IUserNft[]) => {
    const loadNftMetadata = async (userNft: IUserNft): Promise<INFTTokenMetadata | undefined> => {
      if (userNft.nft.tokenURI && userNft.nft.tokenURI !== "") {
        try {
          const dataResponse = await fetch(ipfsTransformUri(userNft.nft.tokenURI));
          const object = await dataResponse.json();
          return object;
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getNftsMetadata = async (nftsToFetch: IUserNft[]): Promise<IUserNft[]> =>
      Promise.all(
        nftsToFetch.map(async (nft) => {
          const existsMetadata = userNfts.find((v) => v.id === nft.id)?.metadata;
          const metadata = existsMetadata ?? ((await loadNftMetadata(nft)) as INFTTokenMetadata);

          return { ...nft, metadata } as IUserNft;
        })
      );

    const nftsWithData = await getNftsMetadata(userNftsData);

    setUserNfts(nftsWithData);
  };

  useEffect(() => {
    let cancelled = false;
    if (vaults && networkEnv === "prod") {
      getPrices(vaults).then((prices) => {
        if (!cancelled) setTokenPrices(prices);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [vaults, getPrices, chain, networkEnv]);

  useEffect(() => {
    if (data?.vaults) setVaultsWithDetails(data.vaults);
    if (data?.userNfts) setUserNftsWithMetadata(data.userNfts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.vaults, data.userNfts]);

  const { safetyPeriod, withdrawPeriod } = data?.masters?.[0] || {};

  const withdrawSafetyPeriod = useLiveSafetyPeriod(safetyPeriod, withdrawPeriod);

  const context: IVaultsContext = {
    vaults,
    userNfts,
    tokenPrices,
    masters: data?.masters,
    withdrawSafetyPeriod,
  };

  return <VaultsContext.Provider value={context}>{children}</VaultsContext.Provider>;
}
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
