import { Config } from "@usedapp/core";
import { Chains } from "constants/constants";
import { defaultChain, ENDPOINTS } from "settings";

export const ethersConfig: Config = {
    networks: Object.values(Chains),
    readOnlyChainId: defaultChain.chainId,
    readOnlyUrls: ENDPOINTS,
    autoConnect: true
}

console.log("config", ethersConfig);

