import { useEffect, useState } from "react";
import { appChains } from "settings";
import { useAccount, useNetwork } from "wagmi";

export const useIsReviewer = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    const checkReviewer = async () => {
      if (address && chain && chain.id) {
        const chainId = Number(chain.id);
        const whitelistedReviewers = appChains[Number(chainId)]?.whitelistedReviewers ?? [];
        const whitelistedReviewersLowerCase = whitelistedReviewers.map((reviewer) => reviewer.toLowerCase());

        setIsReviewer(whitelistedReviewersLowerCase.includes(address.toLowerCase()));
      }
    };
    checkReviewer();
  }, [address, chain]);

  return isReviewer;
};
