import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { mainnet, goerli, optimismGoerli, optimism, arbitrum } from "wagmi/chains";
import { IMaster, IUserNft, IVault } from "types";
import { appChains } from "settings";
import { GET_VAULTS } from "graphql/subgraph";

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
    fetchData();

    const interval = setInterval(fetchData, DATA_REFRESH_TIME);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isFetched, chainIdTest, chainIdProd };
  // return { data: INITIAL_VAULTS_DATA, chainId: undefined, isFetched: true };
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

  useEffect(() => {
    const allNetworksFetchStatus = [isEthereumFetched, isOptimismFetched, isArbitrumFetched];
    const areAllNetworksFetched = allNetworksFetchStatus.every((status) => status);

    if (!areAllNetworksFetched) return;

    const allVaultsProd = [
      ...(ethereumData?.prod?.vaults?.map((v) => ({ ...v, chainId: ethereumProdChainId })) || []),
      ...(optimismData?.prod?.vaults?.map((v) => ({ ...v, chainId: optimismProdChainId })) || []),
      ...(arbitrumData?.prod?.vaults?.map((v) => ({ ...v, chainId: arbitrumProdChainId })) || []),
    ];

    const allVaultsTest = [
      ...(ethereumData?.test?.vaults?.map((v) => ({ ...v, chainId: ethereumTestChainId })) || []),
      ...(optimismData?.test?.vaults?.map((v) => ({ ...v, chainId: optimismTestChainId })) || []),
      ...(arbitrumData?.test?.vaults?.map((v) => ({ ...v, chainId: arbitrumTestChainId })) || []),
    ];

    const allMastersProd = [
      ...(ethereumData?.prod?.masters?.map((v) => ({ ...v, chainId: ethereumProdChainId })) || []),
      ...(optimismData?.prod?.masters?.map((v) => ({ ...v, chainId: optimismProdChainId })) || []),
      ...(arbitrumData?.prod?.masters?.map((v) => ({ ...v, chainId: arbitrumProdChainId })) || []),
    ];

    const allMastersTest = [
      ...(ethereumData?.test?.masters?.map((v) => ({ ...v, chainId: ethereumTestChainId })) || []),
      ...(optimismData?.test?.masters?.map((v) => ({ ...v, chainId: optimismTestChainId })) || []),
      ...(arbitrumData?.test?.masters?.map((v) => ({ ...v, chainId: arbitrumTestChainId })) || []),
    ];

    const allUserNftsProd = [
      ...(ethereumData?.prod?.userNfts?.map((v) => ({ ...v, chainId: ethereumProdChainId })) || []),
      ...(optimismData?.prod?.userNfts?.map((v) => ({ ...v, chainId: optimismProdChainId })) || []),
      ...(arbitrumData?.prod?.userNfts?.map((v) => ({ ...v, chainId: arbitrumProdChainId })) || []),
    ];

    const allUserNftsTest = [
      ...(ethereumData?.test?.userNfts?.map((v) => ({ ...v, chainId: ethereumTestChainId })) || []),
      ...(optimismData?.test?.userNfts?.map((v) => ({ ...v, chainId: optimismTestChainId })) || []),
      ...(arbitrumData?.test?.userNfts?.map((v) => ({ ...v, chainId: arbitrumTestChainId })) || []),
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

    if (JSON.stringify(vaults.prod) !== JSON.stringify(newDataProd)) setVaults((prev) => ({ ...prev, prod: newDataProd }));
    if (JSON.stringify(vaults.test) !== JSON.stringify(newDataTest)) setVaults((prev) => ({ ...prev, test: newDataTest }));
  }, [
    vaults,
    ethereumData,
    optimismData,
    arbitrumData,
    ethereumTestChainId,
    ethereumProdChainId,
    optimismTestChainId,
    optimismProdChainId,
    arbitrumTestChainId,
    arbitrumProdChainId,
    isEthereumFetched,
    isOptimismFetched,
    isArbitrumFetched,
  ]);

  return { data: vaults };
};
