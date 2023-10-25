import { IHackerProfile } from "@hats-finance/shared";
import { useQuery } from "@tanstack/react-query";
import { getProfileByUsername } from "./profilesService";

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
