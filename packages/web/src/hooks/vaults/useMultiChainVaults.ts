import { IMaster, IPayoutGraph, ISubmittedSubmission, IUserNft, IVault } from "@hats-finance/shared";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { appChains } from "settings";
import { useAccount } from "wagmi";
import { parseMasters, parsePayouts, parseSubmissions, parseUserNfts, parseVaults } from "./parser";
import { IGraphVaultsData, getSubgraphData } from "./vaultsService";

const DATA_REFRESH_TIME = 15000;

const INITIAL_NETWORK_DATA = {
  vaults: [] as IVault[],
  masters: [] as IMaster[],
  userNfts: [] as IUserNft[],
  payouts: [] as IPayoutGraph[],
  submissions: [] as ISubmittedSubmission[],
};
const INITIAL_VAULTS_DATA: IGraphVaultsData = {
  test: { ...INITIAL_NETWORK_DATA },
  prod: { ...INITIAL_NETWORK_DATA },
};

export const useMultiChainVaultsV2 = () => {
  const { address: account } = useAccount();

  const [multiChainData, setMultiChainData] = useState<IGraphVaultsData>(INITIAL_VAULTS_DATA);
  const [allChainsLoaded, setAllChainsLoaded] = useState(false);

  const subgraphQueries = useQueries({
    queries: Object.keys(appChains).map((chainId) => ({
      queryKey: ["subgraph", chainId],
      queryFn: () => getSubgraphData(+chainId, account),
      refetchInterval: DATA_REFRESH_TIME,
      refetchIntervalInBackground: false,
    })),
  });

  useEffect(() => {
    // if (subgraphQueries.some((a) => a.isLoading)) return;

    const vaultsData = subgraphQueries.reduce(
      (acc, query) => {
        if (!query.data) return acc;

        const { chainId, data } = query.data;

        // Add chainId to all the objects inside query data
        data.masters = parseMasters(data.masters, chainId);
        data.userNfts = parseUserNfts(data.userNfts, chainId);
        data.vaults = parseVaults(data.vaults, chainId);
        data.payouts = parsePayouts(data.payouts, chainId);
        data.submissions = parseSubmissions(data.submissions, chainId);

        if (appChains[chainId].chain.testnet) {
          acc.test.masters = [...acc.test.masters, ...data.masters];
          acc.test.userNfts = [...acc.test.userNfts, ...data.userNfts];
          acc.test.vaults = [...acc.test.vaults, ...data.vaults];
          acc.test.payouts = [...acc.test.payouts, ...data.payouts];
          acc.test.submissions = [...acc.test.submissions, ...data.submissions];
        } else {
          acc.prod.masters = [...acc.prod.masters, ...data.masters];
          acc.prod.userNfts = [...acc.prod.userNfts, ...data.userNfts];
          acc.prod.vaults = [...acc.prod.vaults, ...data.vaults];
          acc.prod.payouts = [...acc.prod.payouts, ...data.payouts];
          acc.prod.submissions = [...acc.prod.submissions, ...data.submissions];
        }

        return acc;
      },
      { test: { ...INITIAL_NETWORK_DATA }, prod: { ...INITIAL_NETWORK_DATA } }
    );

    if (JSON.stringify(vaultsData) !== JSON.stringify(multiChainData)) {
      setMultiChainData(vaultsData);
      setAllChainsLoaded(subgraphQueries.every((a) => a.isFetched));
    }
  }, [subgraphQueries, multiChainData]);

  return { multiChainData, allChainsLoaded };
};
