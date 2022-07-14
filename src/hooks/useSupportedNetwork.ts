import { useEthers } from "@usedapp/core";
import { Chains } from "constants/constants";

export function useSupportedNetwork() {
  const { chainId } = useEthers();
  return Object.keys(Chains).some(id => Number(id) === chainId);
}
