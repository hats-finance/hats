import { useCallback, useEffect, useState } from "react";
import { ChainId, useEthers } from "@usedapp/core";
import { IMaster, IVault } from "types/types";
import { defaultChain, IS_PROD } from "settings";
import { GET_VAULTS } from "graphql/subgraph";
import { ChainsConfig } from "config/chains";

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: ChainsConfig[ChainId.Mainnet], test: ChainsConfig[ChainId.Goerli] },
  OPTIMISM: { prod: ChainsConfig[ChainId.Optimism], test: ChainsConfig[ChainId.OptimismGoerli] },
};

const useSubgraphFetch = (chainName: keyof typeof supportedChains, networkEnv: "prod" | "test") => {
  const [data, setData] = useState<{ vaults: IVault[]; masters: IMaster[] }>({ vaults: [], masters: [] });
  const chainId = supportedChains[chainName][networkEnv]?.chain.id;

  const fetchData = useCallback(async () => {
    const subgraphUrl = ChainsConfig[chainId || defaultChain.chain.id].subgraph;
    const res = await fetch(subgraphUrl, {
      method: "POST",
      body: JSON.stringify({ query: GET_VAULTS, variables: {} }),
      headers: { "Content-Type": "application/json" },
    });
    const dataJson = await res.json();

    setData(dataJson.data);
  }, [chainId]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, DATA_REFRESH_TIME);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, chainId };
};

export const useMultiChainVaults = () => {
  const [vaults, setVaults] = useState<{ vaults: IVault[]; masters: IMaster[] }>({ vaults: [], masters: [] });
  const { chainId } = useEthers();
  const connectedChain = chainId ? ChainsConfig[chainId] : null;

  const showTestnets = connectedChain ? connectedChain.chain.testnet : !IS_PROD;
  const networkEnv = showTestnets ? "test" : "prod";

  const { data: ethereumData, chainId: ethereumChainId } = useSubgraphFetch("ETHEREUM", networkEnv);
  const { data: optimismData, chainId: optimismChainId } = useSubgraphFetch("OPTIMISM", networkEnv);

  // console.log("ethereumData", ethereumData.vaults);
  // console.log("optimismData", optimismData.vaults);

  useEffect(() => {
    const allVaults = [
      ...(ethereumData?.vaults?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.vaults?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
    ];

    const allMasters = [
      ...(ethereumData?.masters?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.masters?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
    ];

    setVaults({ vaults: allVaults, masters: allMasters });
  }, [ethereumData, optimismData, ethereumChainId, optimismChainId]);

  return { data: vaults };
};
