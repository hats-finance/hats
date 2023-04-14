import { IPayoutResponse, getExecutePayoutSafeTransaction } from "@hats-finance/shared";
import Safe from "@safe-global/safe-core-sdk";
import { ethers } from "ethers";
import { useNetwork, useProvider } from "wagmi";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import EthSignSignature from "@safe-global/safe-core-sdk/dist/src/utils/signatures/SafeSignature";
import EthersAdapter from "@safe-global/safe-ethers-lib";

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
    const { chain } = useNetwork();
    const provider = useProvider();

    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;

    return {
      send: async (beneficiary: string, descriptionHash: string, bountyPercentageOrSeverityIndex: string | number) => {
        if (!vault || !payout || !contractAddress) return;
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);

        const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider });
        const safeSdk = await Safe.create({ ethAdapter, safeAddress: vault.committee });

        const safeTransaction = await getExecutePayoutSafeTransaction(provider, vault.committee, payout.vaultInfo, {
          beneficiary,
          descriptionHash,
          bountyPercentageOrSeverityIndex,
        });
        const safeTransactionHash = await safeSdk.getTransactionHash(safeTransaction);

        // Check the safe transaction hash returned by the API
        if (safeTransactionHash !== payout.txToSign) {
          throw new Error("Safe transaction hash does not match the one returned by the API");
        }

        // Add the collected signatures to the safe transaction
        for (const signature of payout.signatures) {
          safeTransaction.addSignature(new EthSignSignature(signature.signerAddress, signature.signature));
        }

        await safeSdk.executeTransaction(safeTransaction);

        console.log(safeTransaction);

        // console.log(safeTransaction);
        // // safeTransaction.addSignature({});

        // //  safeSdk.executeTransaction({
        // //   signatures
        // //  })

        // console.log([beneficiary as `0x${string}`, bountyPercentage, descriptionHash]);

        // return executePayout.write!({
        //   recklesslySetUnpreparedArgs: [beneficiary as `0x${string}`, bountyPercentage, descriptionHash],
        // });
      },
    };
  };
}
