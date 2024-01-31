import {
  IMaster,
  IPayoutData,
  IPayoutGraph,
  IUserNft,
  IVault,
  IVaultDescription,
  IWithdrawSafetyPeriod,
  fixObject,
} from "@hats.finance/shared";
import { OFAC_Sanctioned_Digital_Currency_Addresses } from "data/OFACSanctionedAddresses";
import { PROTECTED_TOKENS } from "data/vaults";
import { tokenPriceFunctions } from "helpers/getContractPrices";
import { INFTTokenMetadata } from "hooks/nft/types";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { IS_PROD, appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { isValidIpfsHash } from "utils/ipfs.utils";
import {
  getBackendTokenPrices,
  getBalancerTokenPrices,
  getCoingeckoTokensPrices,
  getUniswapTokenPrices,
} from "utils/tokens.utils";
import { useAccount, useNetwork } from "wagmi";
import { useLiveSafetyPeriod } from "../../useLiveSafetyPeriod";
import { overrideDescription, overridePayoutVault, populateVaultsWithPricing } from "./parser";
import { useMultiChainVaultsV2 } from "./useMultiChainVaults";

const MAX_CALLS_AT_ONCE = 200;

interface IVaultsContext {
  vaultsReadyAllChains: boolean;
  activeVaults?: IVault[]; // Vaults filtered by dates and chains
  allVaultsOnEnv?: IVault[]; // Vaults filtered by chains but not dates
  allVaults?: IVault[]; // Vaults without dates and chains filtering
  userNfts?: IUserNft[];
  allUserNfts?: IUserNft[]; // User nfts without chains filtering
  tokenPrices?: number[];
  masters?: IMaster[];
  allPayouts?: IPayoutGraph[]; // Payouts without chains filtering
  allPayoutsOnEnv?: IPayoutGraph[]; // Payouts filtered by chains
  withdrawSafetyPeriod?: IWithdrawSafetyPeriod;
}

export const getVaultDateStatus = (startTime: number | undefined, endTime: number | undefined): IVault["dateStatus"] => {
  if (startTime && startTime > Date.now() / 1000) return "upcoming";
  if (endTime && endTime < Date.now() / 1000) return "finished";

  return "on_time";
};

export const VaultsContext = createContext<IVaultsContext>(undefined as any);

export function useVaults(): IVaultsContext {
  return useContext(VaultsContext);
}

export function VaultsProvider({ children }: PropsWithChildren<{}>) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const [vaultsReadyAllChains, setVaultsReadyAllChains] = useState(false);
  const [allVaults, setAllVaults] = useState<IVault[]>([]);
  const [allVaultsOnEnv, setAllVaultsOnEnv] = useState<IVault[]>([]);
  const [activeVaults, setActiveVaults] = useState<IVault[]>([]);
  const [allPayouts, setAllPayouts] = useState<IPayoutGraph[]>([]);
  const [allPayoutsOnEnv, setAllPayoutsOnEnv] = useState<IPayoutGraph[]>([]);
  const [allUserNfts, setAllUserNfts] = useState<IUserNft[]>([]);
  const [userNfts, setUserNfts] = useState<IUserNft[]>([]);
  const [tokenPrices, setTokenPrices] = useState<number[]>();

  const connectedChain = chain ? appChains[chain.id] : null;
  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = !IS_PROD && connectedChain?.chain.testnet;

  if (account && OFAC_Sanctioned_Digital_Currency_Addresses.indexOf(account) !== -1) {
    throw new Error("This wallet address is on the OFAC Sanctioned Digital Currency Addresses list and cannot be used.");
  }

  const { multiChainData, allChainsLoaded } = useMultiChainVaultsV2();

  const getTokenPrices = async (vaultsToSearch: IVault[]) => {
    if (!vaultsToSearch || vaultsToSearch.length === 0) return [];

    const stakingTokens = vaultsToSearch.map((vault) => ({
      address: vault.stakingToken.toLowerCase(),
      chainId: vault.chainId as number,
    }));

    const foundTokenPrices = [] as number[];

    // Get prices from the backend
    try {
      const tokensLeft = stakingTokens.filter((token) => !(token.address in foundTokenPrices));
      const backendTokenPrices = await getBackendTokenPrices();

      if (backendTokenPrices) {
        tokensLeft.forEach((token) => {
          if (backendTokenPrices.hasOwnProperty(token.address)) {
            const price = backendTokenPrices[token.address];
            if (price && +price > 0) foundTokenPrices[token.address] = +price;
          }
        });

        return foundTokenPrices;
      }
    } catch (error) {
      console.error(error);
    }

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

    // Get prices from Balancer
    try {
      const tokensLeft = stakingTokens.filter((token) => !(token.address in foundTokenPrices));
      const balancerTokenPrices = await getBalancerTokenPrices(tokensLeft);

      if (balancerTokenPrices) {
        tokensLeft.forEach((token) => {
          if (balancerTokenPrices.hasOwnProperty(token.address)) {
            const price = balancerTokenPrices[token.address]?.["usd"];
            if (price && +price > 0) foundTokenPrices[token.address] = +price;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }

    console.log(foundTokenPrices);
    return foundTokenPrices;
  };

  const setVaultsWithDetails = async (vaultsData: IVault[]) => {
    const loadVaultDescription = async (vault: IVault): Promise<IVaultDescription | undefined> => {
      if (isValidIpfsHash(vault.descriptionHash)) {
        try {
          const dataResponse = await fetch(ipfsTransformUri(vault.descriptionHash)!);
          if (dataResponse.status === 200) {
            const object = await dataResponse.json();
            return overrideDescription(vault.id, fixObject(object));
          }
          return undefined;
        } catch (error) {
          // console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getVaultsData = async (vaultsToFetch: IVault[]): Promise<IVault[]> => {
      const vaults = [] as IVault[];

      for (let i = 0; i < vaultsToFetch.length; i += MAX_CALLS_AT_ONCE) {
        const vaultsChunk = vaultsToFetch.slice(i, i + MAX_CALLS_AT_ONCE);
        const vaultsData = await Promise.all(
          vaultsChunk.map(async (vault) => {
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
        vaults.push(...vaultsData);
      }

      return vaults;
    };

    const allVaultsData = await getVaultsData(vaultsData);
    const allVaultsDataWithDatesInfo = allVaultsData.map((vault) => {
      const startTime = vault.description?.["project-metadata"].starttime;
      const endTime = vault.description?.["project-metadata"].endtime;

      return {
        ...vault,
        dateStatus: getVaultDateStatus(startTime, endTime),
      } as IVault;
    });

    const prices = showTestnets ? [] : await getTokenPrices(allVaultsDataWithDatesInfo);
    if (JSON.stringify(tokenPrices) !== JSON.stringify(prices)) setTokenPrices(prices);

    const allVaultsDataWithPrices = populateVaultsWithPricing(allVaultsDataWithDatesInfo, prices);

    const filteredByChain = allVaultsDataWithPrices.filter((vault) => {
      return showTestnets ? appChains[vault.chainId as number].chain.testnet : !appChains[vault.chainId as number].chain.testnet;
    });

    const filteredByChainAndDate = filteredByChain.filter((vault) => vault.dateStatus === "on_time");

    // TODO: remove this in order to support multiple vaults again
    //const vaultsWithMultiVaults = addMultiVaults(vaultsWithDescription);
    if (JSON.stringify(allVaults) !== JSON.stringify(allVaultsDataWithPrices)) setAllVaults(allVaultsDataWithPrices);
    if (JSON.stringify(allVaultsOnEnv) !== JSON.stringify(filteredByChain)) setAllVaultsOnEnv(filteredByChain);
    if (JSON.stringify(activeVaults) !== JSON.stringify(filteredByChainAndDate)) setActiveVaults(filteredByChainAndDate);

    if (allChainsLoaded) setVaultsReadyAllChains(true);
  };

  const setPayoutsWithDetails = async (payoutsData: IPayoutGraph[]) => {
    const loadPayoutData = async (payout: IPayoutGraph): Promise<IPayoutData | undefined> => {
      if (isValidIpfsHash(payout.payoutDataHash)) {
        try {
          const dataResponse = await fetch(ipfsTransformUri(payout.payoutDataHash)!);
          if (dataResponse.status === 200) {
            const payoutData = (await dataResponse.json()) as IPayoutData;
            return {
              ...payoutData,
              vault: overridePayoutVault(payoutData),
            } as IPayoutData;
          }
          return undefined;
        } catch (error) {
          // console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getPayoutsData = async (payoutsToFetch: IPayoutGraph[]): Promise<IPayoutGraph[]> =>
      Promise.all(
        payoutsToFetch.map(async (payout) => {
          const existsPayoutData = allPayouts.find((p) => p.id === payout.id)?.payoutData;
          const payoutData = existsPayoutData ?? ((await loadPayoutData(payout)) as IPayoutData);

          return {
            ...payout,
            payoutData,
          } as IPayoutGraph;
        })
      );

    const allPayoutsData = await getPayoutsData(payoutsData);

    const filteredByChain = allPayoutsData.filter((vault) => {
      return showTestnets ? appChains[vault.chainId as number].chain.testnet : !appChains[vault.chainId as number].chain.testnet;
    });

    if (JSON.stringify(allPayouts) !== JSON.stringify(allPayoutsData)) setAllPayouts(allPayoutsData);
    if (JSON.stringify(allPayoutsOnEnv) !== JSON.stringify(filteredByChain)) setAllPayoutsOnEnv(filteredByChain);
  };

  const setUserNftsWithMetadata = async (userNftsData: IUserNft[]) => {
    const loadNftMetadata = async (userNft: IUserNft): Promise<INFTTokenMetadata | undefined> => {
      if (userNft.nft.tokenURI && userNft.nft.tokenURI !== "") {
        try {
          const dataResponse = await fetch(ipfsTransformUri(userNft.nft.tokenURI));
          const object = await dataResponse.json();
          return object;
        } catch (error) {
          // console.error(error);
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
    setVaultsWithDetails([...multiChainData.prod.vaults, ...multiChainData.test.vaults]);
    setUserNftsWithMetadata([...multiChainData.prod.userNfts, ...multiChainData.test.userNfts]);
    setPayoutsWithDetails([...multiChainData.prod.payouts, ...multiChainData.test.payouts]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiChainData, showTestnets, allChainsLoaded]);

  const { safetyPeriod, withdrawPeriod } =
    (showTestnets ? multiChainData?.test.masters?.[0] : multiChainData?.prod.masters?.[0]) ?? {};

  const withdrawSafetyPeriod = useLiveSafetyPeriod(safetyPeriod, withdrawPeriod);

  const context: IVaultsContext = {
    vaultsReadyAllChains,
    activeVaults,
    allVaults,
    allVaultsOnEnv,
    userNfts,
    allUserNfts,
    tokenPrices,
    withdrawSafetyPeriod,
    allPayouts,
    allPayoutsOnEnv,
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
