import { Endpoints, VaultService, Chains, DefaultBotAddress, VaultSubgraphs } from "./constants/constants";
import { Chain, ChainId, Goerli, Mainnet } from '@usedapp/core';

export const CHAINID: ChainId = process.env.REACT_APP_CHAINID ? parseInt(process.env.REACT_APP_CHAINID) as ChainId : undefined || ChainId.Goerli;
export const ENDPOINTS = Endpoints
if (process.env.REACT_APP_ENDPOINT_MAINNET) {
    ENDPOINTS[Mainnet.chainId] = process.env.REACT_APP_ENDPOINT_MAINNET;
}
export const VAULT_SUBGRAPHS = VaultSubgraphs
// if (process.env.REACT_APP_VAULT_SUBGRAPH_GOERLI) {
//     console.log("new subgraph for goerli", process.env.REACT_APP_VAULT_SUBGRAPH_GOERLI);
//     VAULT_SUBGRAPHS[Goerli.chainId] = process.env.REACT_APP_VAULT_SUBGRAPH_GOERLI;
// }
export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const DEFAULT_BOT = process.env.REACT_APP_DEFAULT_BOT || DefaultBotAddress;

export const defaultChain: Chain = Chains[CHAINID];
