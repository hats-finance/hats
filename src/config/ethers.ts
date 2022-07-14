import { Config, Mainnet, Rinkeby } from "@usedapp/core";
import { Chains, Endpoint } from "constants/constants";
import { defaultChain } from "settings";

if (process.env.REACT_APP_ENDPOINT_MAINNET) {
    Endpoint[Mainnet.chainId] = process.env.REACT_APP_ENDPOINT_MAINNET;
}
if (process.env.REACT_APP_ENDPOINT_RINKEBY) {
    Endpoint[Rinkeby.chainId] = process.env.REACT_APP_ENDPOINT_RINKEBY;
}


export const ethersConfig: Config = {
    networks: Object.values(Chains),
    readOnlyChainId: defaultChain.chainId,
    readOnlyUrls: Endpoint,
    autoConnect: true
}
