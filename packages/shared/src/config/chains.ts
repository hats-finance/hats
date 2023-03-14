import { Chain, arbitrum, goerli, mainnet, optimism, optimismGoerli } from "@wagmi/chains";

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
    vaultsNFTContract: "0x225A2A0Dea1357c808B4eb8BC423507dD4bbc401",
    chain: mainnet,
    subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hats",
    coingeckoId: "ethereum",
    govMultisig: "0xBA5Ddb6Af728F01E91D77D12073548D823f6D1ef",
  },
  [goerli.id]: {
    vaultsCreatorContract: "0x54FecFaec05140e292B978164985edE92cBAB7d5",
    rewardController: "0x0000000000000000000000000000000000000000",
    vaultsNFTContract: "0x4127f8BF5C591f8DE8071279aA40316af7a45703",
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
  // ============ HARDHAT ============
  // [ChainId.Hardhat]: {
  //     vaultsNFTContract: "",
  //     chain: Hardhat,
  //     endpoint: "http://localhost:8545",
  //     subgraph: "http://localhost:8000/subgraphs/name/hats-nft"
  // }
};
