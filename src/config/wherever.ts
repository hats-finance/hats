import { mainnet, goerli, optimism, optimismGoerli } from "wagmi/chains";
import { WHEREVER_GOERLI_KEY, WHEREVER_MAINNET_KEY } from "settings";

export const WhereverPartnerKeys = {
  [mainnet.id]: WHEREVER_MAINNET_KEY,
  [optimism.id]: WHEREVER_MAINNET_KEY,
  [goerli.id]: WHEREVER_GOERLI_KEY,
  [optimismGoerli.id]: WHEREVER_GOERLI_KEY,
};
