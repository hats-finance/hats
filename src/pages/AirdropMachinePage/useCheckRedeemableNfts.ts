import { usePrevious } from "hooks/usePrevious";
import { useVaults } from "hooks/vaults/useVaults";
import { useEffect, useState } from "react";

export const useCheckRedeemableNfts = async (toggleAirdropPrompt: () => void) => {
  const [shown, setShown] = useState(false);
  const { nftData } = useVaults();
  const { isBeforeDeadline, treeRedeemablesCount } = nftData || {};
  const prevTreeRedeemableCount = usePrevious(treeRedeemablesCount);

  useEffect(() => {
    if (!shown && isBeforeDeadline && treeRedeemablesCount && treeRedeemablesCount !== prevTreeRedeemableCount) {
      setShown(true);
      toggleAirdropPrompt();
    }
  }, [shown, isBeforeDeadline, treeRedeemablesCount, prevTreeRedeemableCount, toggleAirdropPrompt]);
};
