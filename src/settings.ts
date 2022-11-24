import { VaultService, DefaultBotAddress, StagingBotAddress } from "./constants/constants";
import { Chain, ChainId, Mainnet } from "@usedapp/core";
import { ChainsConfig } from "config/chains";

export const CHAINS = ChainsConfig;
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
export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY ?? "";

export const defaultChain: Chain = ChainsConfig[CHAINID].chain;
