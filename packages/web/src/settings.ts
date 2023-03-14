import { ChainsConfig, IChainConfiguration } from "@hats-finance/shared";
import { mainnet } from "wagmi/chains";
import { stagingServiceUrl, prodServiceUrl } from "./constants/constants";

const prodHosts = ["localhost"];

export const IS_PROD = prodHosts.includes(window.location.hostname);
export const BASE_SERVICE_URL = process.env.REACT_APP_SERVICE_URL ?? (IS_PROD ? prodServiceUrl : stagingServiceUrl);

export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY ?? "";
export const WHEREVER_MAINNET_KEY = process.env.REACT_APP_WHEREVER_MAINNET_KEY;
export const WHEREVER_GOERLI_KEY = process.env.REACT_APP_WHEREVER_GOERLI_KEY;

export const defaultChain: IChainConfiguration = ChainsConfig[mainnet.id];

// If we're in production, only mainnet is enabled
export const appChains = ChainsConfig;
