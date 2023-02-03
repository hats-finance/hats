import { Chain } from "wagmi";
import { mainnet, goerli, optimismGoerli } from "wagmi/chains";

export interface IChainConfiguration {
  vaultsNFTContract?: string;
  vaultsCreatorContract?: string;
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
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
    coingeckoId: "ethereum",
  },
  [goerli.id]: {
    vaultsCreatorContract: "0x86a57E0f0e22D5eC40DE1ec990757Ae5A397A19b",
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
