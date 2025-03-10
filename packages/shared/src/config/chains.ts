import * as wagmiChains from "@wagmi/chains";
import { meter, oasis } from "./custom_chains";

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
  [wagmiChains.base.id]: wagmiChains.base,
  [meter.id]: meter,
  [oasis.id]: oasis,
};

export interface IChainConfiguration {
  vaultsNFTContract: string;
  hackersNFTContract: string;
  vaultsCreatorContract: string;
  arbitratorContract: string;
  paymentSplitterFactory: string;
  rewardController?: string;
  govMultisig: string;
  growthMultisig: string;
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
    // vaultsCreatorContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3", v2
    vaultsCreatorContract: "0x67aCdEb1a2b6cC7C77F9550a034aAd1f1e5A6C3C",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x1569fd54478b25e3accf3bac3f231108d95f50c4",
    hackersNFTContract: "0x10C483158B8aF7e91CE7068bA45eb5446789851D",
    chain: wagmiChains.mainnet,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/2cbCwzhBbKkdpXtuNYkG5ch5dJDNAnTmeRhePDpkR4JV",
    coingeckoId: "ethereum",
    govMultisig: "0xBA5Ddb6Af728F01E91D77D12073548D823f6D1ef",
    growthMultisig: "0x53E9152417EcD338E7e85cCFBc1F5eDA053C910c",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    paymentSplitterFactory: "0x8633212777Da1394bb379Df9520f098B014fB77b",
    infuraKey: "mainnet",
    provider: "https://eth-mainnet.g.alchemy.com/v2/gRQ81Lr6Vnbm5WgD4Et6csRjnEv3V83Z",
  },
  [wagmiChains.sepolia.id]: {
    // vaultsCreatorContract: "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A", v2
    vaultsCreatorContract: "0x5d7A4fA7942681c570DdEAA6e2D203E15516AA93", // v3
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x89e477E69E591EF24a7Af27d358CF6889B0924ab",
    vaultsNFTContract: "0x96E93876eB2314901ee9967488C650D77A50c705",
    hackersNFTContract: "0x2Ff0509D0e9a78Bf58815D768f4487f0645824F0",
    chain: wagmiChains.sepolia,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/6q8vE8znoVRd2AqdGcgaF7j99Gtrrki4HwYDVMK8qaCf",
    coingeckoId: undefined,
    govMultisig: "0xFA6579F3Bb1793eFaB541de06763b872E11bfCBe",
    growthMultisig: "0xA5BA173Cf84D532FE368690D37eff843678E0bFF",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: undefined,
    paymentSplitterFactory: "0x8343D06cDFDe42cA0864029D5fE6138433A68a24",
    infuraKey: "sepolia",
    provider: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
  },
  [wagmiChains.optimism.id]: {
    // vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48", v2
    vaultsCreatorContract: "0x58958226fb12DDfC407a7766d51baB2a88d08BF1",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    hackersNFTContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    chain: wagmiChains.optimism,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/vMkoKYXdwa5dww7FD6ra9EdLgA2E3hmz2Q3BxF8DEAW",
    coingeckoId: "optimistic-ethereum",
    govMultisig: "0x5A6910528b047d3371970dF764ba4046b7DfAd6a",
    growthMultisig: "0x862966C9e09a3058DF47a29d30a429565E176D8B",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
    paymentSplitterFactory: "0x0aA1464dB005857Db8FC3E0470d306FB9E54b908",
    infuraKey: "optimism-mainnet",
    provider: "",
  },
  [wagmiChains.arbitrum.id]: {
    // vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48", v2
    vaultsCreatorContract: "0x145b550aC44c3d052e9200937DFaB0B163C538dE",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4",
    hackersNFTContract: "0xC570c434ba30a2fa5C07E590833246E18aa6B0a3",
    chain: wagmiChains.arbitrum,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/GXUgxLXF1Ad2dmmxF5J24JUGKj6ko22t6esPkdLhKAz4",
    coingeckoId: "arbitrum-one",
    govMultisig: "0x022B95b4c02bbA85604506E6114485615b0aD09A",
    growthMultisig: "0xBCa8856B5995092Df3f100436b0Ee8056A2E065a",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal",
    paymentSplitterFactory: "0x83E0dfc2c1891Ada906D8F266029F2a416BC8b3f",
    infuraKey: "arbitrum-mainnet",
    provider: "",
  },
  [wagmiChains.polygon.id]: {
    // vaultsCreatorContract: "0xa80d0a371f4d37AFCc55188233BB4Ad463aF9E48", v2
    vaultsCreatorContract: "0x0aa1464db005857db8fc3e0470d306fb9e54b908",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x878Cab06E6f4a85D90E5f236d326a41Ef6f44F9f",
    hackersNFTContract: "0x312917812e76d78C5B1139C28d5C1D3A272d171d",
    chain: wagmiChains.polygon,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/GH7Cv6XKuWYTMUrXcAfcqRmJRERPxFThyHtz1AeNCZQa",
    coingeckoId: "polygon-pos",
    govMultisig: "0xa5c6d757ca69c92eea05b22924d9774658e10c62",
    growthMultisig: "0xa5c6d757ca69c92eea05b22924d9774658e10c62",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    uniswapSubgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
    paymentSplitterFactory: "0x10C483158B8aF7e91CE7068bA45eb5446789851D",
    infuraKey: "polygon-mainnet",
    provider: "",
  },
  [wagmiChains.gnosis.id]: {
    // vaultsCreatorContract: "0x304A70840D8D43B288A6e4e4e718081BBcF160be", v2
    vaultsCreatorContract: "0x2Ff0509D0e9a78Bf58815D768f4487f0645824F0",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x07368F6a959Ef3096230a258dd0af692699c3a4c",
    hackersNFTContract: "0xe198CBb727758b9Ad38a12E1ad475a843e5e730F",
    chain: wagmiChains.gnosis,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/HPwWDxud8fSarSK8XfwSxcTkyKMQf7RwFmS7kPmTX9dD",
    coingeckoId: "xdai",
    govMultisig: "0xE650ba24115AE0260d8f723F89603DaF63b496cA",
    growthMultisig: "0xE650ba24115AE0260d8f723F89603DaF63b496cA",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    paymentSplitterFactory: "0x1065A9e3AC47f2624293727F4b8319A0a10F6015",
    // infuraKey: "polygon-mainnet",
    provider: "",
  },
  [wagmiChains.bsc.id]: {
    // vaultsCreatorContract: "0xD978eb90eB1b11213e320f4e6e910eB98D8DF1E4", v2
    vaultsCreatorContract: "0xABB34AB93589b0d026a192b6aaCAF8149db05c99",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0xcBe0b90bfe99f827B8BCB5C5Ac4b17107caEA814",
    hackersNFTContract: "0x028A7C6873dFA8357c9dcF9C9d76EF2abb66256E",
    chain: wagmiChains.bsc,
    subgraph:
      "https://gateway-arbitrum.network.thegraph.com/api/0ed4473ee53352068095380ea517339c/subgraphs/id/4TWs2Y9gCpUPh1vMSogFuRbBqsUzE4FXgYFAoJmcx9Fc",
    coingeckoId: "binance-smart-chain",
    govMultisig: "0xbFBC2Ab80bD0A12258db952739238e403Be01ece",
    growthMultisig: "0x6C4654Fe6Efe491D601ca2ff1842e179A5612c38",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    paymentSplitterFactory: "0xadd155731473A9501881234A865FF79668F1B6cF",
    infuraKey: "bsc-mainnet",
    provider: "https://damp-dawn-scion.bsc.quiknode.pro/fa80c7f866eee193fef38c879e941fcb02e98dfb",
  },
  [oasis.id]: {
    vaultsCreatorContract: "0x07368F6a959Ef3096230a258dd0af692699c3a4c",
    arbitratorContract: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x0000000000000000000000000000000000000000",
    hackersNFTContract: "0x0000000000000000000000000000000000000000",
    chain: oasis,
    subgraph: "https://api.goldsky.com/api/public/project_clx0j1z1v44iz01wb4qol83tv/subgraphs/hats_oasis/0.0.1/gn",
    coingeckoId: "oasis-sapphire",
    govMultisig: "0xf2935671015c896D5E1fE4c97caF111F5eEe2b3c",
    growthMultisig: "0x64792e23DfeDA2d153CF058507d71672aC1d09A0",
    whitelistedReviewers: ["0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6"],
    paymentSplitterFactory: "0xe198CBb727758b9Ad38a12E1ad475a843e5e730F",
    provider: "https://sapphire2.oasis.io",
  },
};

export type AirdropFactoryConfig = { chain: wagmiChains.Chain; address: string };
export const AirdropFactoriesChainConfig: {
  test: { airdrop: AirdropFactoryConfig[]; pointdrop: AirdropFactoryConfig[] };
  prod: { airdrop: AirdropFactoryConfig[]; pointdrop: AirdropFactoryConfig[] };
} = {
  test: {
    airdrop: [{ address: "0xcBd1763C9CD705DDf0b7aEbB7f36A7b00E890729", chain: wagmiChains.sepolia }],
    pointdrop: [{ address: "0xCE94b023259E6a49EB37339aCaA3F8e711b88e04", chain: wagmiChains.sepolia }],
  },
  prod: {
    airdrop: [
      { address: "0xf4153be482582e4cD542E2214745a5D3cE5db128", chain: wagmiChains.arbitrum },
      { address: "0xF419C60ac4d9a9d7ea46Deb24c6346bDA41C2a9d", chain: wagmiChains.mainnet },
    ],
    pointdrop: [],
  },
};
