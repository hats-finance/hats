import { useCallback, useEffect, useState } from "react";
import { useNetwork, chain as allChains } from "wagmi";
import { IMaster, IVault } from "types/types";
import { defaultChain, IS_PROD } from "settings";
import { GET_VAULTS } from "graphql/subgraph";
import { ChainsConfig } from "config/chains";

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: ChainsConfig[allChains.mainnet.id], test: ChainsConfig[allChains.goerli.id] },
  OPTIMISM: { prod: ChainsConfig[allChains.optimism.id], test: ChainsConfig[allChains.optimismGoerli.id] },
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
  const { chain } = useNetwork();
  const connectedChain = chain ? ChainsConfig[chain.id] : null;

  const showTestnets = connectedChain ? connectedChain.chain.testnet : !IS_PROD;
  const networkEnv: "test" | "prod" = showTestnets ? "test" : "prod";

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

  return { data: vaults, networkEnv };
};
