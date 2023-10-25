import { IHackerProfile } from "@hats-finance/shared";
import { useQuery } from "@tanstack/react-query";
import { getProfileByAddress } from "./profilesService";

/**
 * Gets a profile by address
 */
export const useProfileByAddress = (address?: string) => {
  return useQuery<IHackerProfile | undefined>({
    queryKey: ["hacker-profile-address", address],
    queryFn: () => getProfileByAddress(address),
    enabled: !!address,
  });
};
