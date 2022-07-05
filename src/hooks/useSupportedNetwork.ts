import { useEthers } from "@usedapp/core";
import { Chains } from "constants/constants";

export function useSupportedNetwork() {
  const { chainId } = useEthers();
  return Object.keys(Chains).find(id => Number(id) === chainId) ? true : false;
}
