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
      address: "0x99D510753552698d13D28c3B2042A37Ac6F9E38C",
      blockCreated: 25_763_467,
    },
  },
} as const satisfies Chain;
