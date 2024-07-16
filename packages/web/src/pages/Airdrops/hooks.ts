import { AirdropFactoryConfig } from "@hats.finance/shared";
import { useQuery } from "@tanstack/react-query";
import { getAirdropsDataByFactory, getDelegatees } from "./airdropsService";

/**
 * Gets the delegatees
 */
export const useDelegatees = (token: string | undefined, chainId: number | undefined) => {
  return useQuery({
    queryKey: ["delegatees"],
    queryFn: () => getDelegatees(token, chainId),
  });
};

/**
 * Gets all the airdrops with data from a list of factories
 */
export const useAirdropsByFactories = (factories: AirdropFactoryConfig[]) => {
  return useQuery({
    queryKey: ["airdrop-by-factories"],
    queryFn: async () => {
      return (await Promise.all(factories.map((f) => getAirdropsDataByFactory(f)))).flat();
    },
  });
};
