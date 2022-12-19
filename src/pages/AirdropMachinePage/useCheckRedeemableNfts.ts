import { useAirdropData } from "hooks/nft/useAirdropData";
import { usePrevious } from "hooks/usePrevious";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { mainnet } from "@wagmi/core/chains";

export const useCheckRedeemableNfts = async (toggleAirdropPrompt: () => void) => {
  const [shown, setShown] = useState(false);
  const { address } = useAccount();
  const airdropData = useAirdropData(address, mainnet.id);
  const { isBeforeDeadline, airdropTokens } = airdropData || {};
  const redeemablesCount = airdropTokens?.filter((token) => !token.isRedeemed).length;
  const prevRedeemableCount = usePrevious(redeemablesCount);

  useEffect(() => {
    if (!shown && isBeforeDeadline && redeemablesCount && redeemablesCount !== prevRedeemableCount) {
      setShown(true);
      toggleAirdropPrompt();
    }
  }, [shown, isBeforeDeadline, redeemablesCount, prevRedeemableCount, toggleAirdropPrompt]);
};
