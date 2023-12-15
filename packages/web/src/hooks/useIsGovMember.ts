import { isAddressAMultisigMember } from "@hats.finance/shared";
import { useEffect, useState } from "react";
import { appChains } from "settings";
import { useAccount, useNetwork } from "wagmi";

export const useIsGovMember = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [isGovMember, setIsGovMember] = useState(false);

  useEffect(() => {
    const checkGovMember = async () => {
      if (address && chain && chain.id) {
        const chainId = Number(chain.id);
        const govMultisig = appChains[Number(chainId)]?.govMultisig;

        const isGov = await isAddressAMultisigMember(govMultisig, address, chainId);
        setIsGovMember(isGov);
      }
    };
    checkGovMember();
  }, [address, chain]);

  return isGovMember;
};
