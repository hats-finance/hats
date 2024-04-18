import * as wagmiChains from "@wagmi/chains";
import { meter } from "./custom_chains";

export const ALL_CHAINS = {
  [wagmiChains.mainnet.id]: wagmiChains.mainnet,
  [wagmiChains.arbitrum.id]: wagmiChains.arbitrum,
  [wagmiChains.optimism.id]: wagmiChains.optimism,
  [wagmiChains.polygon.id]: wagmiChains.polygon,
  [wagmiChains.polygonZkEvm.id]: wagmiChains.polygonZkEvm,
  [wagmiChains.bsc.id]: wagmiChains.bsc,
  [wagmiChains.avalanche.id]: wagmiChains.avalanche,
  [wagmiChains.fantom.id]: wagmiChains.fantom,
  [wagmiChains.gnosis.id]: wagmiChains.gnosis,
  [wagmiChains.pulsechain.id]: wagmiChains.pulsechain,
  [wagmiChains.cronos.id]: wagmiChains.cronos,
  [wagmiChains.zkSync.id]: wagmiChains.zkSync,
  [meter.id]: meter,
};

export interface IChainConfiguration {
  vaultsNFTContract: string;
  hackersNFTContract: string;
  vaultsCreatorContract: string;
  arbitratorContract: string;
  airdropContract?: string;
  paymentSplitterFactory: string;
  rewardController?: string;
  govMultisig?: string;
  whitelistedReviewers?: string[];
  chain: wagmiChains.Chain;
  subgraph: string;
  coingeckoId?: string;
  uniswapSubgraph?: string;
  infuraKey?: string;
  provider: string;
}

/**
 * Returns all the  supported chains on the platform.
 * If you want to add a new chain, add it here and also on `useMultiChainVaults` hook.
 */
export const ChainsConfig: { [index: number]: IChainConfiguration } = {
  [wagmiChains.mainnet.id]: {
    vaultsCreatorContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x1569fd54478b25e3accf3bac3f231108d95f50c4",
    hackersNFTContract: "0x10C483158B8aF7e91CE7068bA45eb5446789851D",
    chain: wagmiChains.mainnet,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
    coingeckoId: "ethereum",
    govMultisig: "0xBA5Ddb6Af728F01E91D77D12073548D823f6D1ef",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    paymentSplitterFactory: "0x0aA1464dB005857Db8FC3E0470d306FB9E54b908",
    infuraKey: "mainnet",
    provider: "https://eth-mainnet.g.alchemy.com/v2/gRQ81Lr6Vnbm5WgD4Et6csRjnEv3V83Z",
  },
  // [wagmiChains.goerli.id]: {
  //   vaultsCreatorContract: "0x357D2B22A235E0b0F83926ceE9b0D0fF8489e03b",
  //   arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  //   rewardController: "0x0000000000000000000000000000000000000000",
  //   vaultsNFTContract: "0xCD22290206442B89662820F8dc48E3AD12F5571b",
  //   hackersNFTContract: "0x340adA7f98ccCC70588A9B1Ccf5Ff037D65AC72e",
  //   chain: wagmiChains.goerli,
  //   subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_goerli",
  //   coingeckoId: undefined,
  //   govMultisig: "0xFc9F1d127f8047B0F41e9eAC2Adc2e5279C568B7",
  //   whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
  //   uniswapSubgraph: undefined,
  //   paymentSplitterFactory: "0x728654Bb8E69b9978E79657332a0843606d64FF4",
  //   infuraKey: "goerli",
  //   provider: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
  // },
  [wagmiChains.sepolia.id]: {
    // vaultsCreatorContract: "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A", v2
    vaultsCreatorContract: "0x5d7A4fA7942681c570DdEAA6e2D203E15516AA93", // v3
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x89e477E69E591EF24a7Af27d358CF6889B0924ab",
    vaultsNFTContract: "0x96E93876eB2314901ee9967488C650D77A50c705",
    hackersNFTContract: "0x2Ff0509D0e9a78Bf58815D768f4487f0645824F0",
    chain: wagmiChains.sepolia,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_sepolia",
    coingeckoId: undefined,
    govMultisig: "0xFA6579F3Bb1793eFaB541de06763b872E11bfCBe",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: undefined,
    paymentSplitterFactory: "0x09959581544511916A80185FFe3De3Df11D623D7",
    infuraKey: "sepolia",
    provider: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
    airdropContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  },
  [wagmiChains.optimism.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    hackersNFTContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    chain: wagmiChains.optimism,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism",
    coingeckoId: "optimistic-ethereum",
    govMultisig: "0x5A6910528b047d3371970dF764ba4046b7DfAd6a",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
    paymentSplitterFactory: "0x028A7C6873dFA8357c9dcF9C9d76EF2abb66256E",
    infuraKey: "optimism-mainnet",
    provider: "https://winter-alien-reel.optimism.quiknode.pro/3b8fcb9fa592b6025c5ec16de15be9e85ed0e051",
  },
  // [wagmiChains.optimismGoerli.id]: {
  //   vaultsCreatorContract: "0x8633212777Da1394bb379Df9520f098B014fB77b",
  //   arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  //   rewardController: "0x0000000000000000000000000000000000000000",
  //   vaultsNFTContract: "0x8eb48eD456106Ef31929A832e29E61FE444b1B62",
  //   hackersNFTContract: "0x81ce6022297Ab5e15ba295159aA4BDac6b84A76D",
  //   chain: wagmiChains.optimismGoerli,
  //   subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_optimism_goerli",
  //   coingeckoId: undefined,
  //   uniswapSubgraph: undefined,
  //   paymentSplitterFactory: "0x83E0dfc2c1891Ada906D8F266029F2a416BC8b3f",
  //   infuraKey: "optimism-goerli",
  //   provider: "https://ultra-convincing-bridge.optimism-goerli.quiknode.pro/89adbb9cfd7355f03b21eb6f8ebd959bea78c68b",
  // },
  [wagmiChains.arbitrum.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    hackersNFTContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    chain: wagmiChains.arbitrum,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_arbitrum",
    coingeckoId: "arbitrum-one",
    govMultisig: "0x022B95b4c02bbA85604506E6114485615b0aD09A",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal",
    paymentSplitterFactory: "0x028A7C6873dFA8357c9dcF9C9d76EF2abb66256E",
    infuraKey: "arbitrum-mainnet",
    provider: "https://few-maximum-voice.arbitrum-mainnet.quiknode.pro/5abae8858e1e7248437717c16d14ff7193d6aae6",
  },
  [wagmiChains.polygon.id]: {
    vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x878Cab06E6f4a85D90E5f236d326a41Ef6f44F9f",
    hackersNFTContract: "0x312917812e76d78C5B1139C28d5C1D3A272d171d",
    chain: wagmiChains.polygon,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_polygon",
    coingeckoId: "polygon-pos",
    govMultisig: "0xa5c6d757ca69c92eea05b22924d9774658e10c62",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
    paymentSplitterFactory: "0xadd155731473A9501881234A865FF79668F1B6cF",
    infuraKey: "polygon-mainnet",
    provider: "https://frequent-billowing-smoke.matic.quiknode.pro/518ec9b749b64717da7d8495bdac26d1d27933d1",
  },
  // [meter.id]: {
  //   vaultsCreatorContract: "0x7e0723Fb43869f7742cEFE1a8b1D86665Bb79ED0",
  //   arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  //   rewardController: "0x0000000000000000000000000000000000000000",
  //   vaultsNFTContract: "0xA1b532Bba529741247239492A25971Df82827Efd",
  //   hackersNFTContract: "0x5d3bbbB82dfb2D89B674Ebdf44F721072799e8aa",
  //   chain: meter,
  //   subgraph: "https://graph.meter.io/subgraphs/name/hats",
  //   coingeckoId: "meter",
  //   govMultisig: "0x538B46F9966f0ef2E35a607adbEc51eDF74C25A4",
  //   whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
  //   paymentSplitterFactory: "0x0512b55C7519f5405aFD299f8AbE4E17C61F3b07",
  //   // infuraKey: "polygon-mainnet",
  //   provider: "https://meter.blockpi.network/v1/rpc/fb714211b5240a1f337e46b063d7734294824527",
  // },
  [wagmiChains.gnosis.id]: {
    vaultsCreatorContract: "0x304A70840D8D43B288A6e4e4e718081BBcF160be",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x07368F6a959Ef3096230a258dd0af692699c3a4c",
    hackersNFTContract: "0xe198CBb727758b9Ad38a12E1ad475a843e5e730F",
    chain: wagmiChains.gnosis,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_gnosis",
    coingeckoId: "xdai",
    govMultisig: "0xE650ba24115AE0260d8f723F89603DaF63b496cA",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    paymentSplitterFactory: "0x878Cab06E6f4a85D90E5f236d326a41Ef6f44F9f",
    // infuraKey: "polygon-mainnet",
    provider: "https://frosty-convincing-choice.xdai.quiknode.pro/db844278bdba30f1567a37c679660797fbbea869",
  },
  // [wagmiChains.bsc.id]: {
  //   vaultsCreatorContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
  //   arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  //   rewardController: "0x0000000000000000000000000000000000000000",
  //   vaultsNFTContract: "0xcBe0b90bfe99f827B8BCB5C5Ac4b17107caEA814",
  //   hackersNFTContract: "0x028A7C6873dFA8357c9dcF9C9d76EF2abb66256E",
  //   chain: wagmiChains.bsc,
  //   subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats_bsc",
  //   coingeckoId: "binance-smart-chain",
  //   govMultisig: "0xbFBC2Ab80bD0A12258db952739238e403Be01ece",
  //   whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
  //   paymentSplitterFactory: "0xadd155731473A9501881234A865FF79668F1B6cF",
  //   provider: "https://damp-dawn-scion.bsc.quiknode.pro/fa80c7f866eee193fef38c879e941fcb02e98dfb",
  // },
  // ============ HARDHAT ============
  // [ChainId.Hardhat]: {
  //     vaultsNFTContract: "",
  //     chain: Hardhat,
  //     endpoint: "http://localhost:8545",
  //     subgraph: "http://localhost:8000/subgraphs/name/hats-nft"
  // }
};

export type AirdropConfig = { chain: wagmiChains.Chain; address: string };
export const AirdropChainConfig: { test: AirdropConfig[]; prod: AirdropConfig[] } = {
  test: [
    {
      chain: wagmiChains.sepolia,
      address: "0x127a2858b513ae6ecc1cec6867a067fd69c1f9c1",
    },
  ],
  prod: [
    {
      chain: wagmiChains.arbitrum,
      address: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    },
  ],
};
