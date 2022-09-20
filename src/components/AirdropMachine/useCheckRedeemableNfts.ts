import { usePrevious } from "hooks/usePrevious";
import { useVaults } from "hooks/useVaults";
import { useEffect } from "react";

export const useCheckRedeemableNfts = async (toggleAirdropPrompt: () => void) => {
  const { nftData } = useVaults();
  const { isBeforeDeadline, treeRedeemablesCount } = nftData || {};
  const prevTreeRedeemableCount = usePrevious(treeRedeemablesCount);

  useEffect(() => {
    if (isBeforeDeadline && treeRedeemablesCount &&
      treeRedeemablesCount !== prevTreeRedeemableCount) {
      toggleAirdropPrompt();
    }
  }, [isBeforeDeadline, treeRedeemablesCount, prevTreeRedeemableCount, toggleAirdropPrompt]);
}
