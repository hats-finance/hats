import { mainnet } from "wagmi/chains";
import { VaultService, DefaultBotAddress, StagingBotAddress } from "./constants/constants";
import { ChainsConfig, IChainConfiguration } from "config/chains";

const prodHosts = ["app.hats.finance"];

export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const IS_PROD = prodHosts.includes(window.location.hostname);
export const DEFAULT_BOT = process.env.REACT_APP_DEFAULT_BOT || (!IS_PROD && StagingBotAddress) || DefaultBotAddress;
export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY ?? "";

export const WHEREVER_MAINNET_KEY = process.env.REACT_APP_WHEREVER_MAINNET_KEY;
export const WHEREVER_GOERLI_KEY = process.env.REACT_APP_WHEREVER_GOERLI_KEY;

export const defaultChain: IChainConfiguration = ChainsConfig[mainnet.id];
