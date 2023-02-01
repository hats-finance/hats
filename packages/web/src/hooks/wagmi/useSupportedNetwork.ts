import { useNetwork } from "wagmi";

export function useSupportedNetwork() {
  const { chain, chains } = useNetwork();
  return chains.some((c) => c.id === chain?.id);
}
