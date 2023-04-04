import { useCallback, useEffect, useState } from "react";
import { useNetwork, useAccount } from "wagmi";
import { mainnet, goerli, optimismGoerli, optimism, arbitrum, polygon, bsc } from "wagmi/chains";
import { IMaster, IUserNft, IVault } from "types";
import { appChains, IS_PROD } from "settings";
import { GET_VAULTS } from "graphql/subgraph";

const INITIAL_VAULTS_DATA: GraphVaultsData = { vaults: [], masters: [], userNfts: [] };

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: appChains[mainnet.id], test: appChains[goerli.id] },
  OPTIMISM: { prod: appChains[optimism.id], test: appChains[optimismGoerli.id] },
  ARBITRUM: { prod: appChains[arbitrum.id], test: null },
  POLYGON: { prod: appChains[polygon.id], test: null },
  BINANCE: { prod: appChains[bsc.id], test: null },
};

interface GraphVaultsData {
  vaults: IVault[];
  masters: IMaster[];
  userNfts: IUserNft[];
}

const useSubgraphFetch = (chainName: keyof typeof supportedChains, networkEnv: "prod" | "test") => {
  const { address: account } = useAccount();
  const [data, setData] = useState<GraphVaultsData>(INITIAL_VAULTS_DATA);
  const [isFetched, setIsFetched] = useState(false);
  const chainId = supportedChains[chainName][networkEnv]?.chain.id;

  const fetchData = useCallback(async () => {
    if (!chainId) {
      setData(INITIAL_VAULTS_DATA);
      return;
    }

    const subgraphUrl = appChains[chainId].subgraph;
    const res = await fetch(subgraphUrl, {
      method: "POST",
      body: JSON.stringify({ query: GET_VAULTS, variables: { account } }),
      headers: { "Content-Type": "application/json" },
      cache: "default",
    });
    const dataJson = await res.json();

    if (JSON.stringify(dataJson.data) !== JSON.stringify(data)) {
      setData(dataJson.data);
      setIsFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, DATA_REFRESH_TIME);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (chainId) return { data, chainId, isFetched };
  return { data: INITIAL_VAULTS_DATA, chainId: undefined, isFetched: true };
};

export const useMultiChainVaults = () => {
  const [vaults, setVaults] = useState<GraphVaultsData>(INITIAL_VAULTS_DATA);
  const { chain } = useNetwork();
  const connectedChain = chain ? appChains[chain.id] : null;

  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = IS_PROD ? false : connectedChain?.chain.testnet ?? false;
  const networkEnv: "test" | "prod" = showTestnets ? "test" : "prod";

  const { data: ethereumData, chainId: ethereumChainId, isFetched: isEthereumFetched } = useSubgraphFetch("ETHEREUM", networkEnv);
  const { data: optimismData, chainId: optimismChainId, isFetched: isOptimismFetched } = useSubgraphFetch("OPTIMISM", networkEnv);
  const { data: arbitrumData, chainId: arbitrumChainId, isFetched: isArbitrumFetched } = useSubgraphFetch("ARBITRUM", networkEnv);
  const { data: polygonData, chainId: polygonChainId, isFetched: isPolygonFetched } = useSubgraphFetch("POLYGON", networkEnv);
  const { data: binanceData, chainId: binanceChainId, isFetched: isBinanceFetched } = useSubgraphFetch("BINANCE", networkEnv);

  useEffect(() => {
    const allNetworksFetchStatus = [isEthereumFetched, isOptimismFetched, isArbitrumFetched, isPolygonFetched, isBinanceFetched];
    const areAllNetworksFetched = allNetworksFetchStatus.every((status) => status);

    if (!areAllNetworksFetched) return;

    const allVaults = [
      ...(ethereumData?.vaults?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.vaults?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
      ...(arbitrumData?.vaults?.map((v) => ({ ...v, chainId: arbitrumChainId })) || []),
      ...(polygonData?.vaults?.map((v) => ({ ...v, chainId: polygonChainId })) || []),
      ...(binanceData?.vaults?.map((v) => ({ ...v, chainId: binanceChainId })) || []),
    ];

    const allMasters = [
      ...(ethereumData?.masters?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.masters?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
      ...(arbitrumData?.masters?.map((v) => ({ ...v, chainId: arbitrumChainId })) || []),
      ...(polygonData?.masters?.map((v) => ({ ...v, chainId: polygonChainId })) || []),
      ...(binanceData?.masters?.map((v) => ({ ...v, chainId: binanceChainId })) || []),
    ];

    const allUserNfts = [
      ...(ethereumData?.userNfts?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.userNfts?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
      ...(arbitrumData?.userNfts?.map((v) => ({ ...v, chainId: arbitrumChainId })) || []),
      ...(polygonData?.userNfts?.map((v) => ({ ...v, chainId: polygonChainId })) || []),
      ...(binanceData?.userNfts?.map((v) => ({ ...v, chainId: binanceChainId })) || []),
    ];

    const newVaults = {
      vaults: allVaults.map((vault) => ({
        ...vault,
      })),
      masters: allMasters,
      userNfts: allUserNfts,
    };

    if (JSON.stringify(vaults) !== JSON.stringify(newVaults)) {
      setVaults({ vaults: allVaults, masters: allMasters, userNfts: allUserNfts });
    }
  }, [
    vaults,
    ethereumData,
    optimismData,
    arbitrumData,
    polygonData,
    binanceData,
    ethereumChainId,
    optimismChainId,
    arbitrumChainId,
    polygonChainId,
    binanceChainId,
    isEthereumFetched,
    isOptimismFetched,
    isArbitrumFetched,
    isPolygonFetched,
    isBinanceFetched,
  ]);

  return { data: vaults, networkEnv };
};
