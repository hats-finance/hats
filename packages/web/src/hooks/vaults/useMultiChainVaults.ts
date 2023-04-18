import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { IMaster, IUserNft, IVault, IPayoutGraph } from "@hats-finance/shared";
import { appChains } from "settings";
import { getSubgraphData, IGraphVaultsData } from "./vaultsService";

const DATA_REFRESH_TIME = 15000;

const INITIAL_NETWORK_DATA = {
  vaults: [] as IVault[],
  masters: [] as IMaster[],
  userNfts: [] as IUserNft[],
  payouts: [] as IPayoutGraph[],
};
const INITIAL_VAULTS_DATA: IGraphVaultsData = {
  test: { ...INITIAL_NETWORK_DATA },
  prod: { ...INITIAL_NETWORK_DATA },
};

export const useMultiChainVaultsV2 = () => {
  const { address: account } = useAccount();

  const [multiChainData, setMultiChainData] = useState<IGraphVaultsData>(INITIAL_VAULTS_DATA);

  const subgraphQueries = useQueries({
    queries: Object.keys(appChains).map((chainId) => ({
      queryKey: ["subgraph", chainId],
      queryFn: () => getSubgraphData(+chainId, account),
      refetchInterval: DATA_REFRESH_TIME,
      refetchIntervalInBackground: false,
    })),
  });

  useEffect(() => {
    if (subgraphQueries.some((a) => a.isLoading)) return;

    const vaultsData = subgraphQueries.reduce(
      (acc, query) => {
        if (!query.data) return acc;

        const { chainId, data } = query.data;

        // Add chainId to all the objects inside query data
        data.masters = data.masters.map((master) => ({ ...master, chainId }));
        data.userNfts = data.userNfts.map((userNft) => ({ ...userNft, chainId }));
        data.vaults = data.vaults.map((vault) => ({ ...vault, chainId }));
        data.payouts = data.payouts.map((payout) => ({ ...payout, chainId }));

        if (appChains[chainId].chain.testnet) {
          acc.test.masters = [...acc.test.masters, ...data.masters];
          acc.test.userNfts = [...acc.test.userNfts, ...data.userNfts];
          acc.test.vaults = [...acc.test.vaults, ...data.vaults];
          acc.test.payouts = [...acc.test.payouts, ...data.payouts];
        } else {
          acc.prod.masters = [...acc.prod.masters, ...data.masters];
          acc.prod.userNfts = [...acc.prod.userNfts, ...data.userNfts];
          acc.prod.vaults = [...acc.prod.vaults, ...data.vaults];
          acc.prod.payouts = [...acc.prod.payouts, ...data.payouts];
        }

        return acc;
      },
      { test: { ...INITIAL_NETWORK_DATA }, prod: { ...INITIAL_NETWORK_DATA } }
    );

    if (JSON.stringify(vaultsData) !== JSON.stringify(multiChainData)) {
      setMultiChainData(vaultsData);
    }
  }, [subgraphQueries, multiChainData]);

  return { multiChainData };
};
