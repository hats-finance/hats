import { useVaults } from "hooks/useVaults";
import { useEffect } from "react";

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { nftData } = useVaults();
  const { isBeforeDeadline, airdropToRedeem } = nftData || {};

  useEffect(() => {
    if (isBeforeDeadline && airdropToRedeem) {
      toggleAirdropPrompt();
    }
    /** TODO: when putting toggleAirdropPrompt in the array we have endless refreshes. Need to fix. */
  }, [isBeforeDeadline, airdropToRedeem, toggleAirdropPrompt])
}
