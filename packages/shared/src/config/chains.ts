import * as wagmiChains from "@wagmi/chains";

export const ALL_CHAINS = {
  [wagmiChains.mainnet.id]: wagmiChains.mainnet,
  [wagmiChains.arbitrum.id]: wagmiChains.arbitrum,
  [wagmiChains.optimism.id]: wagmiChains.optimism,
  [wagmiChains.polygon.id]: wagmiChains.polygon,
  [wagmiChains.bsc.id]: wagmiChains.bsc,
  [wagmiChains.avalanche.id]: wagmiChains.avalanche,
  [wagmiChains.fantom.id]: wagmiChains.fantom,
  [wagmiChains.gnosis.id]: wagmiChains.gnosis,
};

export interface IChainConfiguration {
  vaultsNFTContract: string;
  vaultsCreatorContract: string;
  paymentSplitterFactory: string;
  rewardController?: string;
  govMultisig?: string;
  chain: wagmiChains.Chain;
  subgraph: string;
  coingeckoId?: string;
  uniswapSubgraph?: string;
  infuraKey: string;
  provider: string;
}

/**
 * Returns all the  supported chains on the platform.
 * If you want to add a new chain, add it here and also on `useMultiChainVaults` hook.
 */
export const ChainsConfig: { [index: number]: IChainConfiguration } = {
  [wagmiChains.mainnet.id]: {
    vaultsCreatorContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x1569fd54478b25e3accf3bac3f231108d95f50c4",
    chain: wagmiChains.mainnet,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
    coingeckoId: "ethereum",
    govMultisig: "0xBA5Ddb6Af728F01E91D77D12073548D823f6D1ef",
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    paymentSplitterFactory: "0x0aA1464dB005857Db8FC3E0470d306FB9E54b908",
    infuraKey: "mainnet",
    provider: "https://eth-mainnet.g.alchemy.com/v2/gRQ81Lr6Vnbm5WgD4Et6csRjnEv3V83Z",
  },
  [wagmiChains.goerli.id]: {
    vaultsCreatorContract: "0x357D2B22A235E0b0F83926ceE9b0D0fF8489e03b",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xCD22290206442B89662820F8dc48E3AD12F5571b",
    chain: wagmiChains.goerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_goerli",
    coingeckoId: undefined,
    govMultisig: "0xFc9F1d127f8047B0F41e9eAC2Adc2e5279C568B7",
    uniswapSubgraph: undefined,
    paymentSplitterFactory: "0x728654Bb8E69b9978E79657332a0843606d64FF4",
    infuraKey: "goerli",
    provider: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
  },
  [wagmiChains.optimism.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    chain: wagmiChains.optimism,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism",
    coingeckoId: "optimistic-ethereum",
    govMultisig: "0x5A6910528b047d3371970dF764ba4046b7DfAd6a",
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
    paymentSplitterFactory: "0x028A7C6873dFA8357c9dcF9C9d76EF2abb66256E",
    infuraKey: "optimism-mainnet",
    provider: "https://winter-alien-reel.optimism.quiknode.pro/67c989673429f10875e3c33c4fada905d65f8596",
  },
  [wagmiChains.optimismGoerli.id]: {
    vaultsCreatorContract: "0x8633212777Da1394bb379Df9520f098B014fB77b",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x8eb48eD456106Ef31929A832e29E61FE444b1B62",
    chain: wagmiChains.optimismGoerli,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
    coingeckoId: undefined,
    uniswapSubgraph: undefined,
    paymentSplitterFactory: "0x83E0dfc2c1891Ada906D8F266029F2a416BC8b3f",
    infuraKey: "optimism-goerli",
    provider: "https://ultra-convincing-bridge.optimism-goerli.quiknode.pro/c9541e51b0a7432c1cd61a2c1c8d8f56c9dc07c0",
  },
  [wagmiChains.arbitrum.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    chain: wagmiChains.arbitrum,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_arbitrum",
    coingeckoId: "arbitrum-one",
    govMultisig: "0x022B95b4c02bbA85604506E6114485615b0aD09A",
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal",
    paymentSplitterFactory: "0x028A7C6873dFA8357c9dcF9C9d76EF2abb66256E",
    infuraKey: "arbitrum-mainnet",
    provider: "https://few-maximum-voice.arbitrum-mainnet.quiknode.pro/54a8151a31505218a22ac84ac688e3f5e6584cd1",
  },
  [wagmiChains.polygon.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x878Cab06E6f4a85D90E5f236d326a41Ef6f44F9f",
    chain: wagmiChains.polygon,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_polygon",
    coingeckoId: "polygon-pos",
    govMultisig: "0xa5c6d757ca69c92eea05b22924d9774658e10c62",
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
    paymentSplitterFactory: "0xadd155731473A9501881234A865FF79668F1B6cF",
    infuraKey: "polygon-mainnet",
    provider: "https://frequent-billowing-smoke.matic.quiknode.pro/7c8df8ebd0e2c06e4559485d777e99c0350208c8",
  },
  // [wagmiChains.bsc.id]: {
  //   vaultsCreatorContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
  //   rewardController: "0x0000000000000000000000000000000000000000",
  //   vaultsNFTContract: "0xcBe0b90bfe99f827B8BCB5C5Ac4b17107caEA814",
  //   chain: wagmiChains.bsc,
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
