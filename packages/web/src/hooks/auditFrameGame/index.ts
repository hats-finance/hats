import { useIsUserOptedIn } from "./useIsUserOptedIn";
import { useOptIn } from "./useOptIn";
import { useOptOut } from "./useOptOut";
import { useOptedInList } from "./useOptedInList";

export const useAuditFrameGame = (editSessionIdOrAddress?: string) => {
  const optIn = useOptIn();
  const optOut = useOptOut();
  const isUserOptedIn = useIsUserOptedIn(editSessionIdOrAddress);
  const optedInList = useOptedInList(editSessionIdOrAddress);

  return {
    optIn,
    optOut,
    isUserOptedIn,
    optedInList,
  };
};
