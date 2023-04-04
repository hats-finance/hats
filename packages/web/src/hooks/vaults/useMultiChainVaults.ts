import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { mainnet, goerli, optimismGoerli, optimism, arbitrum, polygon, bsc } from "wagmi/chains";
import { IMaster, IUserNft, IVault } from "types";
import { appChains } from "settings";
import { GET_VAULTS } from "graphql/subgraph";
import { useTabFocus } from "hooks/useTabFocus";

const INITIAL_NETWORK_DATA = { vaults: [], masters: [], userNfts: [] };
const INITIAL_VAULTS_DATA: GraphVaultsData = {
  test: INITIAL_NETWORK_DATA,
  prod: INITIAL_NETWORK_DATA,
};

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: appChains[mainnet.id], test: appChains[goerli.id] },
  OPTIMISM: { prod: appChains[optimism.id], test: appChains[optimismGoerli.id] },
  ARBITRUM: { prod: appChains[arbitrum.id], test: null },
  POLYGON: { prod: appChains[polygon.id], test: null },
  BINANCE: { prod: appChains[bsc.id], test: null },
};

interface GraphVaultsData {
  test: {
    vaults: IVault[];
    masters: IMaster[];
    userNfts: IUserNft[];
  };
  prod: {
    vaults: IVault[];
    masters: IMaster[];
    userNfts: IUserNft[];
  };
}

const useSubgraphFetch = (chainName: keyof typeof supportedChains) => {
  const isTabFocused = useTabFocus();

  const { address: account } = useAccount();
  const [data, setData] = useState<GraphVaultsData>(INITIAL_VAULTS_DATA);
  const [isFetched, setIsFetched] = useState(false);

  const chainIdTest = supportedChains[chainName]["test"]?.chain.id;
  const chainIdProd = supportedChains[chainName]["prod"]?.chain.id;

  const fetchData = useCallback(
    async () => {
      if (chainIdTest) {
        const subgraphUrlTest = appChains[chainIdTest].subgraph;
        const resTest = await fetch(subgraphUrlTest, {
          method: "POST",
          body: JSON.stringify({ query: GET_VAULTS, variables: { account } }),
          headers: { "Content-Type": "application/json" },
          cache: "default",
        });
        const dataJsonTest = await resTest.json();

        if (JSON.stringify(dataJsonTest.data) !== JSON.stringify(data.test)) {
          setData((prev) => ({ ...prev, test: dataJsonTest.data ?? INITIAL_NETWORK_DATA }));
        }
      }

      if (chainIdProd) {
        const subgraphUrlProd = appChains[chainIdProd].subgraph;
        const resProd = await fetch(subgraphUrlProd, {
          method: "POST",
          body: JSON.stringify({ query: GET_VAULTS, variables: { account } }),
          headers: { "Content-Type": "application/json" },
          cache: "default",
        });
        const dataJsonProd = await resProd.json();

        if (JSON.stringify(dataJsonProd.data) !== JSON.stringify(data.prod)) {
          setData((prev) => ({ ...prev, prod: dataJsonProd.data ?? INITIAL_NETWORK_DATA }));
        }
      }

      setIsFetched(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account]
  );

  useEffect(() => {
    if (isTabFocused) fetchData();

    const interval = setInterval(isTabFocused ? fetchData : () => {}, DATA_REFRESH_TIME);
    return () => clearInterval(interval);
  }, [fetchData, isTabFocused]);

  return { data, isFetched, chainIdTest, chainIdProd };
};

export const useMultiChainVaults = () => {
  const [vaults, setVaults] = useState<GraphVaultsData>(INITIAL_VAULTS_DATA);

  const {
    data: ethereumData,
    chainIdTest: ethereumTestChainId,
    chainIdProd: ethereumProdChainId,
    isFetched: isEthereumFetched,
  } = useSubgraphFetch("ETHEREUM");
  const {
    data: optimismData,
    chainIdTest: optimismTestChainId,
    chainIdProd: optimismProdChainId,
    isFetched: isOptimismFetched,
  } = useSubgraphFetch("OPTIMISM");
  const {
    data: arbitrumData,
    chainIdTest: arbitrumTestChainId,
    chainIdProd: arbitrumProdChainId,
    isFetched: isArbitrumFetched,
  } = useSubgraphFetch("ARBITRUM");
  const {
    data: polygonData,
    chainIdTest: polygonTestChainId,
    chainIdProd: polygonProdChainId,
    isFetched: isPolygonFetched,
  } = useSubgraphFetch("POLYGON");
  const {
    data: binanceData,
    chainIdTest: binanceTestChainId,
    chainIdProd: binanceProdChainId,
    isFetched: isBinanceFetched,
  } = useSubgraphFetch("BINANCE");

  useEffect(() => {
    const allNetworksFetchStatus = [isEthereumFetched, isOptimismFetched, isArbitrumFetched, isPolygonFetched, isBinanceFetched];
    const areAllNetworksFetched = allNetworksFetchStatus.every((status) => status);

    if (!areAllNetworksFetched) return;

    const allVaultsProd = [
      ...(ethereumData?.prod?.vaults?.map((v) => ({ ...v, chainId: ethereumProdChainId })) || []),
      ...(optimismData?.prod?.vaults?.map((v) => ({ ...v, chainId: optimismProdChainId })) || []),
      ...(arbitrumData?.prod?.vaults?.map((v) => ({ ...v, chainId: arbitrumProdChainId })) || []),
      ...(polygonData?.prod?.vaults?.map((v) => ({ ...v, chainId: polygonProdChainId })) || []),
      ...(binanceData?.prod?.vaults?.map((v) => ({ ...v, chainId: binanceProdChainId })) || []),
    ];

    const allVaultsTest = [
      ...(ethereumData?.test?.vaults?.map((v) => ({ ...v, chainId: ethereumTestChainId })) || []),
      ...(optimismData?.test?.vaults?.map((v) => ({ ...v, chainId: optimismTestChainId })) || []),
      ...(arbitrumData?.test?.vaults?.map((v) => ({ ...v, chainId: arbitrumTestChainId })) || []),
      ...(polygonData?.test?.vaults?.map((v) => ({ ...v, chainId: polygonTestChainId })) || []),
      ...(binanceData?.test?.vaults?.map((v) => ({ ...v, chainId: binanceTestChainId })) || []),
    ];

    const allMastersProd = [
      ...(ethereumData?.prod?.masters?.map((v) => ({ ...v, chainId: ethereumProdChainId })) || []),
      ...(optimismData?.prod?.masters?.map((v) => ({ ...v, chainId: optimismProdChainId })) || []),
      ...(arbitrumData?.prod?.masters?.map((v) => ({ ...v, chainId: arbitrumProdChainId })) || []),
      ...(polygonData?.prod?.masters?.map((v) => ({ ...v, chainId: polygonProdChainId })) || []),
      ...(binanceData?.prod?.masters?.map((v) => ({ ...v, chainId: binanceProdChainId })) || []),
    ];

    const allMastersTest = [
      ...(ethereumData?.test?.masters?.map((v) => ({ ...v, chainId: ethereumTestChainId })) || []),
      ...(optimismData?.test?.masters?.map((v) => ({ ...v, chainId: optimismTestChainId })) || []),
      ...(arbitrumData?.test?.masters?.map((v) => ({ ...v, chainId: arbitrumTestChainId })) || []),
      ...(polygonData?.test?.masters?.map((v) => ({ ...v, chainId: polygonTestChainId })) || []),
      ...(binanceData?.test?.masters?.map((v) => ({ ...v, chainId: binanceTestChainId })) || []),
    ];

    const allUserNftsProd = [
      ...(ethereumData?.prod?.userNfts?.map((v) => ({ ...v, chainId: ethereumProdChainId })) || []),
      ...(optimismData?.prod?.userNfts?.map((v) => ({ ...v, chainId: optimismProdChainId })) || []),
      ...(arbitrumData?.prod?.userNfts?.map((v) => ({ ...v, chainId: arbitrumProdChainId })) || []),
      ...(polygonData?.prod?.userNfts?.map((v) => ({ ...v, chainId: polygonProdChainId })) || []),
      ...(binanceData?.prod?.userNfts?.map((v) => ({ ...v, chainId: binanceProdChainId })) || []),
    ];

    const allUserNftsTest = [
      ...(ethereumData?.test?.userNfts?.map((v) => ({ ...v, chainId: ethereumTestChainId })) || []),
      ...(optimismData?.test?.userNfts?.map((v) => ({ ...v, chainId: optimismTestChainId })) || []),
      ...(arbitrumData?.test?.userNfts?.map((v) => ({ ...v, chainId: arbitrumTestChainId })) || []),
      ...(polygonData?.test?.userNfts?.map((v) => ({ ...v, chainId: polygonTestChainId })) || []),
      ...(binanceData?.test?.userNfts?.map((v) => ({ ...v, chainId: binanceTestChainId })) || []),
    ];

    const newDataProd = {
      vaults: allVaultsProd.map((vault) => ({
        ...vault,
      })),
      masters: allMastersProd,
      userNfts: allUserNftsProd,
    };

    const newDataTest = {
      vaults: allVaultsTest.map((vault) => ({
        ...vault,
      })),
      masters: allMastersTest,
      userNfts: allUserNftsTest,
    };

    const newData = {
      prod: newDataProd,
      test: newDataTest,
    };

    if (JSON.stringify(vaults) !== JSON.stringify(newData)) setVaults(newData);
  }, [
    vaults,
    ethereumData,
    optimismData,
    arbitrumData,
    polygonData,
    binanceData,
    ethereumTestChainId,
    ethereumProdChainId,
    optimismTestChainId,
    optimismProdChainId,
    arbitrumTestChainId,
    arbitrumProdChainId,
    polygonProdChainId,
    polygonTestChainId,
    binanceProdChainId,
    binanceTestChainId,
    isEthereumFetched,
    isOptimismFetched,
    isArbitrumFetched,
    isPolygonFetched,
    isBinanceFetched,
  ]);

  return { data: vaults };
};
