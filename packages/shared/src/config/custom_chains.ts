import { Chain } from "@wagmi/core";

export const meter = {
  id: 82,
  name: "Meter",
  network: "meter",
  nativeCurrency: {
    decimals: 18,
    name: "MeterStable",
    symbol: "MTR",
  },
  rpcUrls: {
    public: { http: ["https://meter.blockpi.network/v1/rpc/public"] },
    default: { http: ["https://meter.blockpi.network/v1/rpc/public"] },
  },
  blockExplorers: {
    etherscan: { name: "Meter Explorer", url: "https://scan.meter.io " },
    default: { name: "Meter Explorer", url: "https://scan.meter.io " },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 25_763_467,
    },
  },
} as const satisfies Chain;

export const oasis = {
  id: 23294,
  name: "Oasis Saphire",
  network: "oasis",
  nativeCurrency: {
    decimals: 18,
    name: "ROSE",
    symbol: "ROSE",
  },
  rpcUrls: {
    public: { http: ["https://sapphire.oasis.io"] },
    default: { http: ["https://sapphire.oasis.io"] },
  },
  blockExplorers: {
    etherscan: { name: "Oasis Explorer", url: "https://explorer.oasis.io/mainnet/sapphire" },
    default: { name: "Oasis Explorer", url: "https://explorer.oasis.io/mainnet/sapphire" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 7345317,
    },
  },
} as const satisfies Chain;
