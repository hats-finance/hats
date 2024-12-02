import { IPayoutResponse, IVault, getExecutePayoutSafeTransaction } from "@hats.finance/shared";
import Safe from "@safe-global/protocol-kit";
import { useState } from "react";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useNetwork, useProvider, useSignTypedData, useSigner } from "wagmi";

export const useSignPayout = (vault?: IVault, payout?: IPayoutResponse) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const signPayout = useSignTypedData();
  const provider = useProvider();

  const [isLoading, setIsLoading] = useState(false);

  const signTypedData = async () => {
    if (!vault || !payout || !signer) return;
    setIsLoading(true);

    try {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      const protocolKit = await Safe.init({
        provider: (signer.provider as any)?.provider as never,
        safeAddress: vault.committee,
        signer: (await signer.getAddress()) as never,
      });

      const providerUrl = provider.chains?.find((c) => c.id === vault.chainId)?.rpcUrls.default.http[0];
      if (!providerUrl) return;

      const { tx: safeTransaction } = await getExecutePayoutSafeTransaction(providerUrl, vault.committee, payout);

      const signature = await protocolKit.signTypedData(safeTransaction);

      return signature.data;
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
