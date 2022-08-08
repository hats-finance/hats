import { useVaults } from "hooks/useVaults";
import { useEffect } from "react";

export const useCheckRedeemableNfts = async (toggleAirdropPrompt: () => void, toggleEmbassyPrompt: () => void) => {
  const { nftData } = useVaults();
  const { isBeforeDeadline, airdropToRedeem, depositToRedeem } = nftData || {};

  useEffect(() => {
    if (isBeforeDeadline && airdropToRedeem) {
      toggleAirdropPrompt();
    }
    if (depositToRedeem) {
      toggleEmbassyPrompt();
    }
    /** TODO: when putting toggleAirdropPrompt/toggleEmbassyPrompt in the array we have endless refreshes. Need to fix. */
  }, [isBeforeDeadline, airdropToRedeem, depositToRedeem])
}
