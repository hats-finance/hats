import { useEthers } from "@usedapp/core";
import { Chains } from "constants/constants";

export function useSupportedNetwork() {
  const { chainId } = useEthers();

  if (Object.keys(Chains).find(id => Number(id) === chainId)) {
    return true;
  } else {
    return false;
  }
}
