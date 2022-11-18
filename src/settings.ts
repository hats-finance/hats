import { VaultService, DefaultBotAddress, StagingBotAddress } from "./constants/constants";
import { Chain, ChainId, Mainnet } from "@usedapp/core";
import { Chains } from "constants/chains";

export const CHAINS = Chains;
const prodHosts = ["app.hats.finance"];

export const CHAINID: ChainId = process.env.REACT_APP_CHAINID
  ? (parseInt(process.env.REACT_APP_CHAINID) as ChainId)
  : ChainId.Goerli;

if (process.env.REACT_APP_ENDPOINT_MAINNET) {
  CHAINS[Mainnet.chainId].endpoint = process.env.REACT_APP_ENDPOINT_MAINNET;
}

export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const IS_PROD = prodHosts.includes(window.location.hostname);
export const DEFAULT_BOT = process.env.REACT_APP_DEFAULT_BOT || (!IS_PROD && StagingBotAddress) || DefaultBotAddress;

export const defaultChain: Chain = Chains[CHAINID].chain;
