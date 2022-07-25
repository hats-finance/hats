import { useVaults } from "hooks/useVaults";
import { useEffect } from "react";

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { nftData } = useVaults();
  const { isBeforeDeadline, redeemable } = nftData || {};
  const somethingToRedeem = redeemable && redeemable.length > 0;

  useEffect(() => {
    if (isBeforeDeadline && somethingToRedeem) {
      toggleAirdropPrompt();
    }
  }, [isBeforeDeadline, somethingToRedeem, toggleAirdropPrompt])
}
