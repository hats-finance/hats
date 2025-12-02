import { IPayoutResponse, IVault, getSafeApiKey, getExecutePayoutSafeTransaction, getGnosisSafeTxServiceBaseUrl } from "@hats.finance/shared";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { utils } from "ethers";
import { useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";

export const useCreatePayoutProposal = (vault?: IVault, payout?: IPayoutResponse) => {
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [isLoading, setIsLoading] = useState(false);

  const create = async () => {
    try {
      if (!vault || !payout || !account || !signer) return false;
      setIsLoading(true);

      let multisigAddress: string | undefined;
      try {
        multisigAddress = utils.getAddress(vault.committee ?? "");
      } catch (error) {
        console.log(error);
        return false;
      }

      if (!multisigAddress) {
        alert("No vault multisig address. Please contact Hats team with this error.");
        return false;
      }

      const protocolKit = await Safe.init({
        provider: (signer.provider as any)?.provider as never,
        safeAddress: multisigAddress,
        signer: (await signer.getAddress()) as never,
      });

      const txServiceUrl = getGnosisSafeTxServiceBaseUrl(vault.chainId);
      const safeApiKey = getSafeApiKey();
      const safeService = new SafeApiKit({
        txServiceUrl,
        chainId: BigInt(vault.chainId),
        ...(safeApiKey && { apiKey: safeApiKey }),
      });

      const providerUrl = provider.chains?.find((c) => c.id === vault.chainId)?.rpcUrls.default.http[0];
      if (!providerUrl) return;

      const { tx: safeTransaction } = await getExecutePayoutSafeTransaction(providerUrl, multisigAddress, payout);

      const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
      const senderSignature = await protocolKit.signTypedData(safeTransaction);
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
