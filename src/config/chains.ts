import { Chain } from "@wagmi/core";
import { mainnet, goerli, optimismGoerli, arbitrum } from "wagmi/chains";

export interface IChainConfiguration {
  vaultsNFTContract?: string;
  chain: Chain;
  subgraph: string;
  coingeckoId?: string;
}

/**
 * Returns all the  supported chains on the platform.
 * If you want to add a new chain, add it here and also on `useMultiChainVaults` hook.
 */
export const ChainsConfig: { [index: number]: IChainConfiguration } = {
  [mainnet.id]: {
    vaultsNFTContract: "0x1569Fd54478B25E3AcCf3baC3f231108D95F50C4",
    chain: mainnet,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
    coingeckoId: "ethereum",
  },
  [goerli.id]: {
    vaultsNFTContract: "0x0196EdC0b3C81B79486E5D99e7D748955EE650D3",
    chain: goerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/goerli_v2_1",
    coingeckoId: undefined,
  },
  // [optimism.id]: {
  //   chain: optimism,
  //   endpoint: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
  //   subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
  //   coingeckoId: "optimistic-ethereum",
  // },
  [optimismGoerli.id]: {
    chain: optimismGoerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
    coingeckoId: undefined,
  },
  [arbitrum.id]: {
    vaultsNFTContract: "0x0000000000000000000000000000000000000000",
    chain: arbitrum,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_arbitrum",
    coingeckoId: "arbitrum-one",
  },
  // ============ HARDHAT ============
  // [ChainId.Hardhat]: {
  //     vaultsNFTContract: "",
  //     chain: Hardhat,
  //     endpoint: "http://localhost:8545",
  //     subgraph: "http://localhost:8000/subgraphs/name/hats-nft"
  // }
};
