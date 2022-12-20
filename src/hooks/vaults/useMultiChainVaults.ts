import { useCallback, useEffect, useState } from "react";
import { useNetwork, useAccount } from "wagmi";
import { mainnet, goerli, optimismGoerli } from "wagmi/chains";
import { IMaster, IUserNft, IVault } from "types/types";
import { IS_PROD } from "settings";
import { GET_VAULTS } from "graphql/subgraph";
import { ChainsConfig } from "config/chains";

const DATA_REFRESH_TIME = 10000;

const supportedChains = {
  ETHEREUM: { prod: ChainsConfig[mainnet.id], test: ChainsConfig[goerli.id] },
  OPTIMISM: { prod: null, test: ChainsConfig[optimismGoerli.id] },
};

interface GraphVaultsData {
  vaults: IVault[];
  masters: IMaster[];
  userNfts: IUserNft[];
}

const useSubgraphFetch = (chainName: keyof typeof supportedChains, networkEnv: "prod" | "test") => {
  const { address: account } = useAccount();
  const [data, setData] = useState<GraphVaultsData>({ vaults: [], masters: [], userNfts: [] });
  const chainId = supportedChains[chainName][networkEnv]?.chain.id;

  const fetchData = useCallback(async () => {
    if (!chainId) {
      setData({ vaults: [], masters: [], userNfts: [] });
      return;
    }

    const subgraphUrl = ChainsConfig[chainId].subgraph;
    const res = await fetch(subgraphUrl, {
      method: "POST",
      body: JSON.stringify({ query: GET_VAULTS, variables: { account } }),
      headers: { "Content-Type": "application/json" },
      cache: "default",
    });
    const dataJson = await res.json();

    if (JSON.stringify(dataJson.data) !== JSON.stringify(data)) {
      setData(dataJson.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, DATA_REFRESH_TIME);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, chainId };
};

export const useMultiChainVaults = () => {
  const [vaults, setVaults] = useState<GraphVaultsData>({ vaults: [], masters: [], userNfts: [] });
  const { chain } = useNetwork();
  const connectedChain = chain ? ChainsConfig[chain.id] : null;

  const showTestnets = connectedChain ? connectedChain.chain.testnet : !IS_PROD;
  const networkEnv: "test" | "prod" = showTestnets ? "test" : "prod";

  const { data: ethereumData, chainId: ethereumChainId } = useSubgraphFetch("ETHEREUM", networkEnv);
  const { data: optimismData, chainId: optimismChainId } = useSubgraphFetch("OPTIMISM", networkEnv);

  useEffect(() => {
    const allVaults = [
      ...(ethereumData?.vaults?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.vaults?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
    ];

    const allMasters = [
      ...(ethereumData?.masters?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.masters?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
    ];

    const allUserNfts = [
      ...(ethereumData?.userNfts?.map((v) => ({ ...v, chainId: ethereumChainId })) || []),
      ...(optimismData?.userNfts?.map((v) => ({ ...v, chainId: optimismChainId })) || []),
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumData, optimismData, ethereumChainId, optimismChainId]);

  return { data: vaults, networkEnv };
};
