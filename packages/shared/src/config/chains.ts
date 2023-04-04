import { Chain, arbitrum, goerli, mainnet, optimism, optimismGoerli, polygon, bsc } from "@wagmi/chains";

export interface IChainConfiguration {
  vaultsNFTContract?: string;
  vaultsCreatorContract?: string;
  rewardController?: string;
  govMultisig?: string;
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
    vaultsCreatorContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x1569fd54478b25e3accf3bac3f231108d95f50c4",
    chain: mainnet,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
    coingeckoId: "ethereum",
    govMultisig: "0xBA5Ddb6Af728F01E91D77D12073548D823f6D1ef",
  },
  [goerli.id]: {
    vaultsCreatorContract: "0x357D2B22A235E0b0F83926ceE9b0D0fF8489e03b",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xCD22290206442B89662820F8dc48E3AD12F5571b",
    chain: goerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_goerli",
    coingeckoId: undefined,
    govMultisig: "0xFc9F1d127f8047B0F41e9eAC2Adc2e5279C568B7",
  },
  [optimism.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    chain: optimism,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism",
    coingeckoId: "optimistic-ethereum",
    govMultisig: "0x5A6910528b047d3371970dF764ba4046b7DfAd6a",
  },
  [optimismGoerli.id]: {
    vaultsCreatorContract: "0x8633212777Da1394bb379Df9520f098B014fB77b",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x8eb48eD456106Ef31929A832e29E61FE444b1B62",
    chain: optimismGoerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
    coingeckoId: undefined,
  },
  [arbitrum.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    chain: arbitrum,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_arbitrum",
    coingeckoId: "arbitrum-one",
    govMultisig: "0x022B95b4c02bbA85604506E6114485615b0aD09A",
  },
  [polygon.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x878Cab06E6f4a85D90E5f236d326a41Ef6f44F9f",
    chain: polygon,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_polygon",
    coingeckoId: "polygon-pos",
    govMultisig: "0xa5c6d757ca69c92eea05b22924d9774658e10c62",
  },
  // [bsc.id]: {
  //   vaultsCreatorContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
  //   rewardController: "0x0000000000000000000000000000000000000000",
  //   vaultsNFTContract: "0xcBe0b90bfe99f827B8BCB5C5Ac4b17107caEA814",
  //   chain: bsc,
  //   subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_bsc",
  //   coingeckoId: "binance-smart-chain",
  //   govMultisig: "0xbFBC2Ab80bD0A12258db952739238e403Be01ece",
  // },
  // ============ HARDHAT ============
  // [ChainId.Hardhat]: {
  //     vaultsNFTContract: "",
  //     chain: Hardhat,
  //     endpoint: "http://localhost:8545",
  //     subgraph: "http://localhost:8000/subgraphs/name/hats-nft"
  // }
};
