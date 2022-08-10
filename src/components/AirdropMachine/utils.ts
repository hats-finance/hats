import { usePrevious } from "hooks/usePrevious";
import { useVaults } from "hooks/useVaults";
import { useEffect } from "react";

export const useCheckRedeemableNfts = async (toggleAirdropPrompt: () => void, toggleEmbassyPrompt: () => void) => {
  const { nftData } = useVaults();
  const { isBeforeDeadline, airdropToRedeem, depositToRedeem } = nftData || {};
  const prevAirdropToRedeem = usePrevious(airdropToRedeem);
  const prevDepositToRedeem = usePrevious(depositToRedeem);

  useEffect(() => {
    if (isBeforeDeadline && airdropToRedeem && prevAirdropToRedeem !== airdropToRedeem) {
      toggleAirdropPrompt();
    }
    if (depositToRedeem && prevDepositToRedeem !== depositToRedeem) {
      toggleEmbassyPrompt();
    }
  }, [isBeforeDeadline,
    airdropToRedeem,
    depositToRedeem,
    toggleAirdropPrompt,
    toggleEmbassyPrompt,
    prevAirdropToRedeem,
    prevDepositToRedeem])
}
