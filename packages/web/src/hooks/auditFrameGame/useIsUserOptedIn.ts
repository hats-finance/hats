import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { useAccount } from "wagmi";
import { useOptedInList } from "./useOptedInList";

export const useIsUserOptedIn = (editSessionIdOrAddress?: string) => {
  const { address } = useAccount();
  const hackerProfile = useCachedProfile(address);
  const { data } = useOptedInList(editSessionIdOrAddress);

  if (data?.find((username) => username.toLowerCase() === hackerProfile?.username.toLowerCase())) return true;
  return false;
};
