import { ChainsConfig, IChainConfiguration } from "@hats.finance/shared";
import { arbitrum, mainnet } from "wagmi/chains";
import { prodServiceUrl, stagingServiceUrl } from "./constants/constants";

const prodHosts = ["app.hats.finance"];

export const IS_PROD = prodHosts.includes(window.location.hostname);
export const BASE_SERVICE_URL = process.env.REACT_APP_SERVICE_URL ?? (IS_PROD ? prodServiceUrl : stagingServiceUrl);

export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY ?? "";
export const WHEREVER_MAINNET_KEY = process.env.REACT_APP_WHEREVER_MAINNET_KEY;
export const WHEREVER_GOERLI_KEY = process.env.REACT_APP_WHEREVER_GOERLI_KEY;
export const ENCRYPTED_STORAGE_KEY = process.env.REACT_APP_ENCRYPTED_STORAGE_KEY ?? "";

export const LOGROCKET_APP_ID = process.env.REACT_APP_LOGROCKET_APP_ID ?? "";

export const defaultChain: IChainConfiguration = ChainsConfig[mainnet.id];

export const appChains = ChainsConfig;

const TGE_ENABLE_TIMESTAMP = IS_PROD ? 1721934000000 : 1721773234000;
export const isAirdropEnabled = Date.now() > TGE_ENABLE_TIMESTAMP;

export const HATS_STAKING_VAULT = {
  address: "0x1025b2248cb6aeaf93c7e4d10b19f90f5b4ea090",
  chain: arbitrum,
};

export const HATS_GITHUB_BOT_ID = 132391680;
