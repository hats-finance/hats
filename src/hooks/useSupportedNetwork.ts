import { ChainsConfig } from "config/chains";
import { useEthers } from "@usedapp/core";

export function useSupportedNetwork() {
  const { chainId } = useEthers();
  return Object.keys(ChainsConfig).some((id) => Number(id) === chainId);
}
