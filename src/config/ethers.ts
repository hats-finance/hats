import { Config } from "@usedapp/core";
import { CHAINS, defaultChain } from "settings";

export const ethersConfig: Config = {
  networks: Object.values(CHAINS).map((chain) => chain.chain),
  readOnlyChainId: defaultChain.chainId,
  readOnlyUrls: Object.fromEntries(Object.entries(CHAINS).map(([chainId, config]) => [chainId, config.endpoint])),
  autoConnect: true,
};
