import { useEffect, useState } from "react";
import { ChainId, useEthers } from "@usedapp/core";
import { Chains } from "constants/chains";
import { IMaster, IVault } from "types/types";
import { IS_PROD } from "settings";
import { useQuery } from "@apollo/client";
import { GET_VAULTS } from "graphql/subgraph";

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: Chains[ChainId.Mainnet], test: Chains[ChainId.Goerli] },
  OPTIMISM: { prod: null, test: Chains[ChainId.OptimismGoerli] },
};

const useSubgraphQuery = (chainName: keyof typeof supportedChains, networkEnv: "prod" | "test") => {
  const chainId = supportedChains[chainName][networkEnv]?.chain.chainId;

  const res = useQuery<{ vaults: IVault[]; masters: IMaster[] }>(GET_VAULTS, {
    variables: { chainId },
    context: { chainId },
    fetchPolicy: "no-cache",
    pollInterval: DATA_REFRESH_TIME,
  });

  return { ...res, chainId };
};

export const useMultiChainVaults = () => {
  const [vaults, setVaults] = useState<{ vaults: IVault[]; masters: IMaster[] }>();
  const { chainId } = useEthers();
  const connectedChain = chainId ? Chains[chainId] : null;

  const showTestnets = connectedChain ? connectedChain.chain.isTestChain : !IS_PROD;
  const networkEnv = showTestnets ? "test" : "prod";

  const { data: ethereumData, chainId: ethereumChainId } = useSubgraphQuery("ETHEREUM", networkEnv);
  const { data: optimismData, chainId: optimismChainId } = useSubgraphQuery("OPTIMISM", networkEnv);

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
