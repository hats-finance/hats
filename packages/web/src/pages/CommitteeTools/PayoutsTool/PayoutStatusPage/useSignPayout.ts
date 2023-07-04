import { IPayoutResponse, IVault, getExecutePayoutSafeTransaction } from "@hats-finance/shared";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { Signer, ethers } from "ethers";
import { useState } from "react";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useNetwork, useProvider, useSignTypedData, useSigner } from "wagmi";

export const useSignPayout = (vault?: IVault, payout?: IPayoutResponse) => {
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const signPayout = useSignTypedData();

  const [isLoading, setIsLoading] = useState(false);

  const signTypedData = async () => {
    if (!vault || !payout) return;
    setIsLoading(true);

    try {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer as Signer });
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: vault.committee });

      const { tx: safeTransaction } = await getExecutePayoutSafeTransaction(provider, vault.committee, payout);

      const signature = await safeSdk.signTypedData(safeTransaction);

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
