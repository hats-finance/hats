import { Endpoint, VaultService, Chains, DefaultBotAddress } from "./constants/constants";
import { Chain, ChainId } from '@usedapp/core';

export const CHAINID: ChainId = process.env.REACT_APP_CHAINID ? parseInt(process.env.REACT_APP_CHAINID) as ChainId : undefined || ChainId.Rinkeby;
export const ENDPOINT = process.env.REACT_APP_ENDPOINT || Endpoint[CHAINID];
export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const DEFAULT_BOT = process.env.REACT_APP_DEFAULT_BOT || DefaultBotAddress;

export const defaultChain: Chain = Chains[CHAINID];
