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
