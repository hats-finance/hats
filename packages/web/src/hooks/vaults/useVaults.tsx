import { useEffect, useState, createContext, useContext, PropsWithChildren } from "react";
import { IMaster, IUserNft, IVault, IVaultDescription, IWithdrawSafetyPeriod, fixObject } from "@hats-finance/shared";
import { useAccount, useNetwork } from "wagmi";
import { appChains, IS_PROD } from "settings";
import { PROTECTED_TOKENS } from "data/vaults";
import { tokenPriceFunctions } from "helpers/getContractPrices";
import { getCoingeckoTokensPrices, getUniswapTokenPrices } from "utils/tokens.utils";
import { ipfsTransformUri } from "utils";
import { blacklistedWallets } from "data/blacklistedWallets";
import { INFTTokenMetadata } from "hooks/nft/types";
import { useLiveSafetyPeriod } from "../useLiveSafetyPeriod";
import { useMultiChainVaultsV2 } from "./useMultiChainVaults";

interface IVaultsContext {
  vaults?: IVault[];
  allVaults?: IVault[]; // Vaults without dates and chains filtering
  userNfts?: IUserNft[];
  allUserNfts?: IUserNft[]; // User nfts without chains filtering
  tokenPrices?: number[];
  masters?: IMaster[];
  withdrawSafetyPeriod?: IWithdrawSafetyPeriod;
}

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults(): IVaultsContext {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }: PropsWithChildren<{}>) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const [allVaults, setAllVaults] = useState<IVault[]>([]);
  const [vaults, setVaults] = useState<IVault[]>([]);
  const [allUserNfts, setAllUserNfts] = useState<IUserNft[]>([]);
  const [userNfts, setUserNfts] = useState<IUserNft[]>([]);
  const [tokenPrices, setTokenPrices] = useState<number[]>();

  const connectedChain = chain ? appChains[chain.id] : null;
  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = !IS_PROD && connectedChain?.chain.testnet;

  if (account && blacklistedWallets.indexOf(account) !== -1) {
    throw new Error("Blacklisted wallet");
  }

  const { multiChainData } = useMultiChainVaultsV2();

  const getTokenPrices = async (vaultsToSearch: IVault[]) => {
    const stakingTokens = vaultsToSearch.map((vault) => ({
      address: vault.stakingToken.toLowerCase(),
      chainId: vault.chainId as number,
    }));

    const foundTokenPrices = [] as number[];

    // Get prices from contracts
    try {
      for (const token in tokenPriceFunctions) {
        const getPriceFunction = tokenPriceFunctions[token];

        if (getPriceFunction) {
          const price = await getPriceFunction();
          if (price && +price > 0) foundTokenPrices[token] = +price;
        }
      }
    } catch (error) {
      console.error(error);
    }

    // Get prices from CoinGecko
    try {
      const tokensLeft = stakingTokens.filter((token) => !(token.address in foundTokenPrices));
      const coingeckoTokenPrices = await getCoingeckoTokensPrices(tokensLeft);

      if (coingeckoTokenPrices) {
        tokensLeft.forEach((token) => {
          if (coingeckoTokenPrices.hasOwnProperty(token.address)) {
            const price = coingeckoTokenPrices[token.address]?.["usd"];
            if (price && +price > 0) foundTokenPrices[token.address] = +price;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }

    // Get prices from Uniswap
    try {
      const tokensLeft = stakingTokens.filter((token) => !(token.address in foundTokenPrices));
      const uniswapTokenPrices = await getUniswapTokenPrices(tokensLeft);

      if (uniswapTokenPrices) {
        tokensLeft.forEach((token) => {
          if (uniswapTokenPrices.hasOwnProperty(token.address)) {
            const price = uniswapTokenPrices[token.address]?.["usd"];
            if (price && +price > 0) foundTokenPrices[token.address] = +price;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }

    return foundTokenPrices;
  };

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

    const vaultsFilteredByDate = allVaultsData.filter((vault) => {
      const startTime = vault.description?.["project-metadata"].starttime;
      const endTime = vault.description?.["project-metadata"].endtime;

      if (startTime && startTime > Date.now() / 1000) return false;
      if (endTime && endTime < Date.now() / 1000) return false;

      return true;
    });

    const vaultsFilteredByNetwork = vaultsFilteredByDate.filter((vault) => {
      return showTestnets ? appChains[vault.chainId as number].chain.testnet : !appChains[vault.chainId as number].chain.testnet;
    });

    // TODO: remove this in order to support multiple vaults again
    //const vaultsWithMultiVaults = addMultiVaults(vaultsWithDescription);
    if (JSON.stringify(allVaults) !== JSON.stringify(allVaultsData)) setAllVaults(allVaultsData);
    if (JSON.stringify(vaults) !== JSON.stringify(vaultsFilteredByNetwork)) setVaults(vaultsFilteredByNetwork);
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

    const nftsFilteredByNetwork = nftsWithData.filter((nft) => {
      return showTestnets ? appChains[nft.chainId as number].chain.testnet : !appChains[nft.chainId as number].chain.testnet;
    });

    if (JSON.stringify(allUserNfts) !== JSON.stringify(nftsWithData)) setAllUserNfts(nftsWithData);
    if (JSON.stringify(userNfts) !== JSON.stringify(nftsFilteredByNetwork)) setUserNfts(nftsFilteredByNetwork);
  };

  useEffect(() => {
    let cancelled = false;
    if (allVaults && !showTestnets) {
      getTokenPrices(allVaults).then((prices) => {
        if (!cancelled) setTokenPrices(prices);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [allVaults, showTestnets]);

  useEffect(() => {
    setVaultsWithDetails([...multiChainData.prod.vaults, ...multiChainData.test.vaults]);
    setUserNftsWithMetadata([...multiChainData.prod.userNfts, ...multiChainData.test.userNfts]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiChainData, showTestnets]);

  const { safetyPeriod, withdrawPeriod } =
    (showTestnets ? multiChainData?.test.masters?.[0] : multiChainData?.prod.masters?.[0]) ?? {};

  const withdrawSafetyPeriod = useLiveSafetyPeriod(safetyPeriod, withdrawPeriod);

  const context: IVaultsContext = {
    vaults,
    allVaults,
    userNfts,
    allUserNfts,
    tokenPrices,
    withdrawSafetyPeriod,
    masters: [...multiChainData.prod.masters, ...multiChainData.test.masters],
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
