import { Endpoints, VaultService, Chains, DefaultBotAddress } from "./constants/constants";
import { Chain, ChainId, Mainnet, Rinkeby } from '@usedapp/core';

export const CHAINID: ChainId = process.env.REACT_APP_CHAINID ? parseInt(process.env.REACT_APP_CHAINID) as ChainId : undefined || ChainId.Rinkeby;
export const ENDPOINTS = Endpoints
if (process.env.REACT_APP_ENDPOINT_MAINNET) {
    ENDPOINTS[Mainnet.chainId] = process.env.REACT_APP_ENDPOINT_MAINNET;
}
if (process.env.REACT_APP_ENDPOINT_RINKEBY) {
    ENDPOINTS[Rinkeby.chainId] = process.env.REACT_APP_ENDPOINT_RINKEBY;
}
export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const DEFAULT_BOT = process.env.REACT_APP_DEFAULT_BOT || DefaultBotAddress;

export const defaultChain: Chain = Chains[CHAINID];
