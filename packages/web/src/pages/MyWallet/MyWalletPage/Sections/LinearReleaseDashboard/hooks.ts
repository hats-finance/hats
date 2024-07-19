import { HATTokenLockFactoriesConfig } from "@hats.finance/shared";
import { useQuery } from "@tanstack/react-query";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { getTokenLocksByFactory } from "./tokenLockService";

/**
 * Gets all the token locks with data from a list of factories
 */
export const useTokenLocksByEnv = () => {
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const isTestnet = connectedChain?.testnet;
  const env = isTestnet && !IS_PROD ? "test" : "prod";

  const factories = Object.entries(HATTokenLockFactoriesConfig[env]).map(([chainId, factory]) => ({
    chainId: Number(chainId),
    address: factory.address,
  }));

  return useQuery({
    queryKey: ["token-locks-by-factories"],
    queryFn: async () => {
      return (await Promise.all(factories.map((f) => getTokenLocksByFactory(f, address)))).flat();
    },
    enabled: !!address,
  });
};
