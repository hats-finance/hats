import { IHackerProfile } from "@hats-finance/shared";
import { useQuery } from "@tanstack/react-query";
import { getProfileByAddress, getProfileByUsername, isUsernameAvailable } from "./profilesService";

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

/**
 * Gets a profile by username
 */
export const useProfileByUsername = (username?: string) => {
  return useQuery<IHackerProfile | undefined>({
    queryKey: ["hacker-profile-username", username],
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
  });
};

/**
 * Gets the availability of a username
 */
export const useUsernameAvailability = (username?: string) => {
  return useQuery<boolean>({
    queryKey: ["hacker-profile-availability", username],
    queryFn: () => isUsernameAvailable(username),
    enabled: !!username,
  });
};
