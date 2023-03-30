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
import { appChains, IS_PROD } from "settings";

interface IVaultsContext {
  vaults?: IVault[];
  allVaults?: IVault[]; // Vaults without dates and chains filtering
  tokenPrices?: number[];
  masters?: IMaster[];
  userNfts?: IUserNft[];
  allUserNfts?: IUserNft[]; // User nfts without chains filtering
  withdrawSafetyPeriod?: IWithdrawSafetyPeriod;
}

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults() {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }) {
  const [allVaults, setAllVaults] = useState<IVault[]>([]);
  const [vaults, setVaults] = useState<IVault[]>([]);
  const [allUserNfts, setAllUserNfts] = useState<IUserNft[]>([]);
  const [userNfts, setUserNfts] = useState<IUserNft[]>([]);
  const [tokenPrices, setTokenPrices] = useState<number[]>();
  const apolloClient = useApolloClient();

  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const connectedChain = chain ? appChains[chain.id] : null;

  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = IS_PROD ? false : connectedChain?.chain.testnet ?? false;
  const networkEnv: "test" | "prod" = showTestnets ? "test" : "prod";

  if (account && blacklistedWallets.indexOf(account) !== -1) {
    throw new Error("Blacklisted wallet");
  }

  const { data } = useMultiChainVaults();

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

  const setAllVaultsWithDetails = async (vaultsData: IVault[]) => {
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

    const vaultsFilteredByDate = allVaultsData.filter((vault) => {
      if (
        vault.description?.["project-metadata"].starttime &&
        vault.description?.["project-metadata"].starttime > Date.now() / 1000
      )
        return false;
      if (vault.description?.["project-metadata"].endtime && vault.description?.["project-metadata"].endtime < Date.now() / 1000)
        return false;
      return true;
    });

    const vaultsFilteredByNetwork = vaultsFilteredByDate.filter((vault) => {
      return networkEnv === "prod"
        ? !appChains[vault.chainId as number].chain.testnet
        : appChains[vault.chainId as number].chain.testnet;
    });

    // TODO: remove this in order to support multiple vaults again
    //const vaultsWithMultiVaults = addMultiVaults(vaultsWithDescription);
    setAllVaults(allVaultsData);
    setVaults(vaultsFilteredByNetwork);
  };

  const setAllUserNftsWithMetadata = async (userNftsData: IUserNft[]) => {
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

    const nftsFilteredByNetwork = nftsWithData.filter((nft) => {
      return networkEnv === "prod"
        ? !appChains[nft.chainId as number].chain.testnet
        : appChains[nft.chainId as number].chain.testnet;
    });

    setAllUserNfts(nftsWithData);
    setUserNfts(nftsFilteredByNetwork);
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
    setAllVaultsWithDetails([...data.prod.vaults, ...data.test.vaults]);
    setAllUserNftsWithMetadata([...data.prod.userNfts, ...data.test.userNfts]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, networkEnv]);

  const { safetyPeriod, withdrawPeriod } = data?.prod.masters?.[0] || {};

  const withdrawSafetyPeriod = useLiveSafetyPeriod(safetyPeriod, withdrawPeriod);

  const context: IVaultsContext = {
    vaults,
    allVaults,
    userNfts,
    allUserNfts,
    tokenPrices,
    masters: [...data.prod.masters, ...data.test.masters],
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
