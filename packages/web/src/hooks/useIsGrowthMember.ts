import { isAddressAMultisigMember } from "@hats.finance/shared";
import { useEffect, useState } from "react";
import { appChains } from "settings";
import { useAccount, useNetwork } from "wagmi";

export const useIsGrowthMember = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [isGrowthMember, setIsGrowthMember] = useState(false);

  useEffect(() => {
    const checkGrowthMember = async () => {
      if (address && chain && chain.id) {
        const chainId = Number(chain.id);
        const growthMultisig = appChains[Number(chainId)]?.growthMultisig;

        const isGrowth = await isAddressAMultisigMember(growthMultisig, address, chainId);
        setIsGrowthMember(isGrowth);
      }
    };
    checkGrowthMember();
  }, [address, chain]);

  return isGrowthMember;
};
