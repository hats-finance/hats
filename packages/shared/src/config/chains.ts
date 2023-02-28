import { Chain, arbitrum, goerli, mainnet, optimism, optimismGoerli } from "@wagmi/chains";

export interface IChainConfiguration {
  vaultsNFTContract?: string;
  vaultsCreatorContract?: string;
  rewardController?: string;
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
    vaultsCreatorContract: "0x8C95B3077A9FE4df7669929478B1Da6BC7378147",
    rewardController: "0x2BC5B4b9d32a3020FC75659A08d14AF755143E50",
    vaultsNFTContract: "0x0196EdC0b3C81B79486E5D99e7D748955EE650D3",
    chain: goerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_goerli",
    coingeckoId: undefined,
  },
  [optimism.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37afcc55188233bb4ad463af9e48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x0000000000000000000000000000000000000000",
    chain: optimism,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism",
    coingeckoId: "optimistic-ethereum",
  },
  [optimismGoerli.id]: {
    vaultsCreatorContract: "0x89e477e69e591ef24a7af27d358cf6889b0924ab",
    rewardController: "0xa9393a4f3ed924cb8459f74e42800cbfbeacf808",
    vaultsNFTContract: "0x0000000000000000000000000000000000000000",
    chain: optimismGoerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
    coingeckoId: undefined,
  },
  [arbitrum.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37afcc55188233bb4ad463af9e48",
    rewardController: "0x0000000000000000000000000000000000000000",
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
