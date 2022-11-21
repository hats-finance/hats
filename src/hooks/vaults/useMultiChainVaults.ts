import { useCallback, useEffect, useState } from "react";
import { ChainId, useEthers } from "@usedapp/core";
import { IMaster, IVault } from "types/types";
import { CHAINS, defaultChain, IS_PROD } from "settings";
import { GET_VAULTS } from "graphql/subgraph";

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: CHAINS[ChainId.Mainnet], test: CHAINS[ChainId.Goerli] },
  OPTIMISM: { prod: CHAINS[ChainId.Optimism], test: CHAINS[ChainId.OptimismGoerli] },
};

// const useSubgraphQuery = (chainName: keyof typeof supportedChains, networkEnv: "prod" | "test") => {
//   const chainId = supportedChains[chainName][networkEnv]?.chain.chainId;

//   console.log("We are using the subgraph for chainId", chainId);

//   const res = useQuery<{ vaults: IVault[]; masters: IMaster[] }>(GET_VAULTS, {
//     variables: { chainId },
//     context: { chainId },
//     fetchPolicy: "no-cache",
//     pollInterval: DATA_REFRESH_TIME,
//   });

//   return { ...res, chainId };
// };

const useSubgraphFetch = (chainName: keyof typeof supportedChains, networkEnv: "prod" | "test") => {
  const [data, setData] = useState<{ vaults: IVault[]; masters: IMaster[] }>({ vaults: [], masters: [] });
  const chainId = supportedChains[chainName][networkEnv]?.chain.chainId;

  const fetchData = useCallback(async () => {
    const subgraphUrl = CHAINS[chainId || defaultChain.chainId].subgraph;
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
  const connectedChain = chainId ? CHAINS[chainId] : null;

  const showTestnets = connectedChain ? connectedChain.chain.isTestChain : !IS_PROD;
  const networkEnv = showTestnets ? "test" : "prod";

  const { data: ethereumData, chainId: ethereumChainId } = useSubgraphFetch("ETHEREUM", networkEnv);
  const { data: optimismData, chainId: optimismChainId } = useSubgraphFetch("OPTIMISM", networkEnv);
  console.log("ethereumData?.vaults", ethereumData?.vaults);
  console.log("optimismData?.vaults", optimismData?.vaults);

  useEffect(() => {
    const allVaults = [
      ...(ethereumData?.vaults?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.vaults?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
    ];

    const allMasters = [
      ...(ethereumData?.masters?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.masters?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
    ];

    console.log("allVaults", allVaults);

    setVaults({ vaults: allVaults, masters: allMasters });
  }, [ethereumData, optimismData, ethereumChainId, optimismChainId]);

  return { data: vaults };
};
