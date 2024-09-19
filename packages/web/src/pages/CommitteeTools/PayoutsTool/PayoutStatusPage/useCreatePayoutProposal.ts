import { IPayoutResponse, IVault, getExecutePayoutSafeTransaction, getGnosisSafeTxServiceBaseUrl } from "@hats.finance/shared";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { Signer, ethers, utils } from "ethers";
import { useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";

export const useCreatePayoutProposal = (vault?: IVault, payout?: IPayoutResponse) => {
  const { address: account } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [isLoading, setIsLoading] = useState(false);

  const create = async () => {
    try {
      if (!vault || !payout || !account) return;
      setIsLoading(true);

      const multisigAddress = utils.getAddress(vault.committee ?? "");
      if (!multisigAddress) {
        alert("No vault multisig address. Please contact Hats team with this error.");
        return false;
      }

      const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer as Signer });
      const txServiceUrl = getGnosisSafeTxServiceBaseUrl(vault.chainId);
      const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: multisigAddress });

      const { tx: safeTransaction } = await getExecutePayoutSafeTransaction(provider, multisigAddress, payout);

      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
      const senderSignature = await safeSdk.signTypedData(safeTransaction);
      await safeService.proposeTransaction({
        safeAddress: multisigAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: account,
        senderSignature: senderSignature.data,
        origin: "https://app.hats.finance",
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    isLoading,
  };
};
