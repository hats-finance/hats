import { IHackerProfile } from "@hats-finance/shared";
import { UseMutationResult, useMutation, useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import {
  IUpsertedProfileResult,
  getProfileByAddress,
  getProfileByUsername,
  isUsernameAvailable,
  upsertProfile,
} from "./profilesService";

/**
 * Gets a profile by address
 */
export const useHackerProfile = () => {
  const { address } = useAccount();

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

/**
 * Upserts a profile
 */
export const useUpsertProfile = (): UseMutationResult<
  IUpsertedProfileResult | undefined,
  string,
  { profile: IHackerProfile; username?: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ profile, username }) => upsertProfile(profile, username),
  });
};
