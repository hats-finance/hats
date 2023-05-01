import { IPayoutResponse, getExecutePayoutSafeTransaction } from "@hats-finance/shared";
import Safe from "@safe-global/safe-core-sdk";
import { TransactionResult } from "@safe-global/safe-core-sdk-types";
import EthSignSignature from "@safe-global/safe-core-sdk/dist/src/utils/signatures/SafeSignature";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { Signer, ethers } from "ethers";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useNetwork, useProvider, useSigner } from "wagmi";

export class ExecutePayoutContract {
  /**
   * Returns a caller function to execute a payout on the registry
   *
   * @remarks
   * This method is supporting v2 vaults only.
   *
   * @param vault - The selected vault to execute the payout
   */
  static hook = (vault?: IVault, payout?: IPayoutResponse) => {
    const { t } = useTranslation();
    const { chain } = useNetwork();
    const provider = useProvider();
    const { data: signer } = useSigner();

    const [data, setData] = useState<TransactionResult | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;

    return {
      data,
      isLoading,
      error,
      isError: !!error,
      send: async () => {
        try {
          if (!vault || !payout || !contractAddress) return;
          setError(undefined);
          setIsLoading(true);

          await switchNetworkAndValidate(chain!.id, vault.chainId as number);

          const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer as Signer });
          const safeSdk = await Safe.create({ ethAdapter, safeAddress: vault.committee });

          const { tx: safeTransaction, txHash: safeTransactionHash } = await getExecutePayoutSafeTransaction(
            provider,
            vault.committee,
            payout
          );

          // Check the safe transaction hash returned by the API
          if (safeTransactionHash !== payout.txToSign) {
            throw new Error("Safe transaction hash does not match the one returned by the API");
          }

          // Add the collected signatures to the safe transaction
          for (const signature of payout.signatures) {
            safeTransaction.addSignature(new EthSignSignature(signature.signerAddress, signature.signature));
          }

          const txResult = await safeSdk.executeTransaction(safeTransaction);
          setData(txResult);
          setIsLoading(false);

          return txResult;
        } catch (error) {
          console.log(error);
          setError(t("Payouts.executePayoutError"));
        } finally {
          setIsLoading(false);
        }
      },
    };
  };
}
