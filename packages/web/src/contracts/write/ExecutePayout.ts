import { IPayoutResponse, getExecutePayoutSafeTransaction } from "@hats.finance/shared";
import Safe, { EthSafeSignature } from "@safe-global/protocol-kit";
import { TransactionResult } from "@safe-global/types-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useNetwork, useSigner } from "wagmi";

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
          if (!vault || !payout || !contractAddress || !signer) return;
          setError(undefined);
          setIsLoading(true);

          await switchNetworkAndValidate(chain!.id, vault.chainId as number);

          console.log("Getting Safe SDK");
          const protocolKit = await Safe.init({
            provider: (signer.provider as any)?.provider as never,
            safeAddress: vault.committee,
            signer: (await signer.getAddress()) as never,
          });
          console.log("Safe SDK done");

          console.log("Getting safe TX");
          const { tx: safeTransaction, txHash: safeTransactionHash } = await getExecutePayoutSafeTransaction(
            signer,
            vault.committee,
            payout
          );
          console.log("Safe TX done", { safeTransaction, safeTransactionHash });

          // Check the safe transaction hash returned by the API
          if (safeTransactionHash !== payout.txToSign) {
            throw new Error("Safe transaction hash does not match the one returned by the API");
          }

          // Add the collected signatures to the safe transaction
          for (const signature of payout.signatures) {
            safeTransaction.addSignature(new EthSafeSignature(signature.signerAddress, signature.signature));
          }

          console.log("Executing safe transaction");
          const txResult = await protocolKit.executeTransaction(safeTransaction);
          console.log("Safe transaction executed", txResult);
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
