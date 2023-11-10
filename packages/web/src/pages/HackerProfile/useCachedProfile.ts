import { IHackerProfile } from "@hats-finance/shared";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

const useAllProfiles = () => {
  return useQuery<IHackerProfile[] | undefined>({
    queryKey: ["all-profiles"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`${BASE_SERVICE_URL}/profile/all`);
        return response.data.profiles;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
  });
};

export const useCachedProfile = (address?: string): IHackerProfile | undefined => {
  const { data: profiles } = useAllProfiles();

  if (!address) return undefined;
  const profileFound = profiles?.find((profile) => profile.addresses.includes(address.toLowerCase()));

  return profileFound;
};
