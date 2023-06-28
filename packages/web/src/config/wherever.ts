import { useSupportedNetwork } from "hooks/wagmi";
import { WHEREVER_GOERLI_KEY, WHEREVER_MAINNET_KEY } from "settings";
import { useAccount, useNetwork } from "wagmi";

export const useKeyWhereverWidget = () => {
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const isSupportedChain = useSupportedNetwork();

  if (!account || !chain || !isSupportedChain) return false;

  const whereverKey = chain.testnet ? WHEREVER_GOERLI_KEY : WHEREVER_MAINNET_KEY;
  if (!whereverKey) return false;

  return whereverKey;
};
