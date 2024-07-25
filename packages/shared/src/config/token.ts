import * as wagmiChains from "@wagmi/chains";

export const HATTokensConfig: {
  test: { [chainId: number]: { address: string; decimals: number; symbol: string } };
  prod: { [chainId: number]: { address: string; decimals: number; symbol: string } };
} = {
  test: {
    [wagmiChains.sepolia.id]: {
      address: "0xbdb34bb8665510d331facaaaa0eeae994a5b6612",
      decimals: 18,
      symbol: "HAT",
    },
  },
  prod: {
    [wagmiChains.arbitrum.id]: {
      address: "0x4D22e37Eb4d71D1acc5f4889a65936D2a44A2f15",
      decimals: 18,
      symbol: "HAT",
    },
    [wagmiChains.mainnet.id]: {
      address: "0x76c4ec0068923Da13Ee11527d6cF9b7521000049",
      decimals: 18,
      symbol: "HAT",
    },
  },
};

export const HATTokenLockFactoriesConfig: {
  test: { [chainId: number]: { address: string } };
  prod: { [chainId: number]: { address: string } };
} = {
  test: {
    [wagmiChains.sepolia.id]: {
      address: "0x0153A75550E32CDf9a4458301bb89b600e745EAf",
    },
  },
  prod: {
    [wagmiChains.arbitrum.id]: {
      address: "0x67aCdEb1a2b6cC7C77F9550a034aAd1f1e5A6C3C",
    },
    [wagmiChains.mainnet.id]: {
      address: "0x22262FB93e56D6109Fd6d630a31faaBF6A1a5987",
    },
  },
};
