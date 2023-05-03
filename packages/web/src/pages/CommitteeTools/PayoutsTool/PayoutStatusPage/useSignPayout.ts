import { EIP712_SAFE_TX_TYPE, IPayoutResponse, IVault, getExecutePayoutSafeTransaction } from "@hats-finance/shared";
import { useState } from "react";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useNetwork, useProvider, useSignTypedData } from "wagmi";

export const useSignPayout = (vault?: IVault, payout?: IPayoutResponse) => {
  const provider = useProvider();
  const { chain } = useNetwork();
  const signPayout = useSignTypedData();

  const [isLoading, setIsLoading] = useState(false);

  const signTypedData = async () => {
    if (!vault || !payout) return;
    setIsLoading(true);

    try {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      const { tx: safeTransaction } = await getExecutePayoutSafeTransaction(provider, vault.committee, payout);

      return signPayout.signTypedDataAsync({
        domain: { verifyingContract: vault.committee as `0x${string}`, chainId: vault.chainId },
        types: EIP712_SAFE_TX_TYPE,
        value: safeTransaction.data as any,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...signPayout,
    isLoading: isLoading || signPayout.isLoading,
    signTypedData,
  };
};
