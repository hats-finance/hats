import { usePrevious } from "hooks/usePrevious";
import { useVaults } from "hooks/useVaults";
import { useEffect } from "react";

export const useCheckRedeemableNfts = async (toggleAirdropPrompt: () => void) => {
  const { nftData } = useVaults();
  const { isBeforeDeadline, treeRedeemables } = nftData || {};
  const prevTreeRedeemables = usePrevious(treeRedeemables);

  useEffect(() => {
    if (isBeforeDeadline && (treeRedeemables?.length ?? 0) > 0 && prevTreeRedeemables?.length !== treeRedeemables?.length) {
      toggleAirdropPrompt();
    }
  }, [isBeforeDeadline,
    treeRedeemables,
    toggleAirdropPrompt,
    prevTreeRedeemables])
}
