import { HATTimelockController_abi, IVault, getGnosisSafeTxServiceBaseUrl } from "@hats-finance/shared";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { Signer, ethers } from "ethers";
import { utils } from "ethers";
import { appChains } from "settings";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { Chain } from "wagmi";
import { IVaultGovActionsForm } from "./GovActionsStatusCard";

export const createVaultGovActionsProposalOnSafe = async (
  govActions: IVaultGovActionsForm,
  vault: IVault,
  extra: { signer: Signer; chain: Chain; account: string }
): Promise<boolean> => {
  try {
    await switchNetworkAndValidate(extra.chain.id, vault.chainId);

    const govAddress = utils.getAddress(appChains[vault.chainId].govMultisig ?? "");
    if (!govAddress) {
      alert("No gov multisig address for this chain. Please contact Hats team with this error.");
      return false;
    }

    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: extra.signer as Signer });
    const txServiceUrl = getGnosisSafeTxServiceBaseUrl(vault.chainId);
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: govAddress });

    const timelockContractInterface = new ethers.utils.Interface(HATTimelockController_abi);

    const safeTransactionData = [] as MetaTransactionData[];

    // Added setVaultVisibility to TRUE
    if (govActions.showVault.active) {
      const txData = timelockContractInterface.encodeFunctionData("setVaultVisibility", [vault.id, true]);
      safeTransactionData.push({
        to: utils.getAddress(vault.master.timelock),
        data: txData,
        value: "0",
      });
    }

    // Added setVaultVisibility to FALSE
    if (govActions.hideVault.active) {
      const txData = timelockContractInterface.encodeFunctionData("setVaultVisibility", [vault.id, false]);
      safeTransactionData.push({
        to: utils.getAddress(vault.master.timelock),
        data: txData,
        value: "0",
      });
    }

    // Added setVaultDescription
    if (govActions.setDescriptionHash.active) {
      const txData = timelockContractInterface.encodeFunctionData("setVaultDescription", [
        vault.id,
        govActions.setDescriptionHash.descriptionHash,
      ]);
      safeTransactionData.push({
        to: utils.getAddress(vault.master.timelock),
        data: txData,
        value: "0",
      });
    }

    const nonce = await safeService.getNextNonce(govAddress);
    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
      options: { nonce },
    });
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    await safeService.proposeTransaction({
      safeAddress: govAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: extra.account,
      senderSignature: senderSignature.data,
      origin: "https://app.hats.finance",
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
