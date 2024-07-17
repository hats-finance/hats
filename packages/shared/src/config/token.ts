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
  prod: {},
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
  prod: {},
};
