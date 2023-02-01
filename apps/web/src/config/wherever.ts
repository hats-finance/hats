import { useAccount, useNetwork } from "wagmi";
import { mainnet, goerli, optimism, optimismGoerli } from "wagmi/chains";
import { WHEREVER_GOERLI_KEY, WHEREVER_MAINNET_KEY } from "settings";
import { useSupportedNetwork } from "hooks/wagmi";

export const WhereverPartnerKeys = {
  [mainnet.id]: WHEREVER_MAINNET_KEY,
  [optimism.id]: WHEREVER_MAINNET_KEY,
  [goerli.id]: WHEREVER_GOERLI_KEY,
  [optimismGoerli.id]: WHEREVER_GOERLI_KEY,
};

export const useKeyWhereverWidget = () => {
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const isSupportedChain = useSupportedNetwork();

  if (!account || !chain || !isSupportedChain) return false;

  const whereverKey = WhereverPartnerKeys[chain.id];
  if (!whereverKey) return false;

  return whereverKey;
};
