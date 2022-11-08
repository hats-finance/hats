import { useEthers } from "@usedapp/core";
import { CHAINS } from "settings";

export function useSupportedNetwork() {
  const { chainId } = useEthers();
  return Object.keys(CHAINS).some(id => Number(id) === chainId);
}
