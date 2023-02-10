import { Chain } from "wagmi";
import { mainnet, goerli, optimismGoerli } from "wagmi/chains";

export interface IChainConfiguration {
  vaultsNFTContract?: string;
  vaultsCreatorContract?: string;
  rewardController?: string;
  chain: Chain;
  endpoint: string;
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
    endpoint: "https://eth-mainnet.alchemyapi.io/v2/c4ovmC7YsQq1qM0lp6h7Ao9bGX_v4JG-",
    subgraph:
      "https://gateway.thegraph.com/api/1c8f0e56a34742a0b26d486419dc4ed5/subgraphs/id/FewLU4ds1nBaDR5oBnucc8YsAsRN9cjM5Th15HyDSWBt",
    coingeckoId: "ethereum",
  },
  [goerli.id]: {
    vaultsCreatorContract: "0x8C95B3077A9FE4df7669929478B1Da6BC7378147",
    rewardController: "0x2BC5B4b9d32a3020FC75659A08d14AF755143E50",
    vaultsNFTContract: "0x0196EdC0b3C81B79486E5D99e7D748955EE650D3",
    chain: goerli,
    endpoint: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
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
    endpoint: "https://opt-goerli.g.alchemy.com/v2/sCQtpxEWIHKdIqHjde149TqzJZHsg0JT",
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
    coingeckoId: undefined,
  },
  // ============ HARDHAT ============
  // [ChainId.Hardhat]: {
  //     vaultsNFTContract: "",
  //     chain: Hardhat,
  //     endpoint: "http://localhost:8545",
  //     subgraph: "http://localhost:8000/subgraphs/name/hats-nft"
  // }
};
