import { useEffect } from "react";
import { useTokenActions } from "hooks/tokenContractHooks";

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { isBeforeDeadline, extendedEligibility } = useTokenActions();
  const somethingToRedeem = extendedEligibility?.some(nft => !nft.isRedeemed);

  useEffect(() => {
    if (isBeforeDeadline && somethingToRedeem) {
      toggleAirdropPrompt();
    }
  }, [isBeforeDeadline, somethingToRedeem])
}
