import { HATTimelockController_abi, IVault, getSafeApiKey, getGnosisSafeTxServiceBaseUrl } from "@hats.finance/shared";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/types-kit";
import { Signer, ethers } from "ethers";
import { utils } from "ethers";
import { appChains } from "settings";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { Chain } from "wagmi";
import { IVaultGovActionsForm } from "./GovActionsStatusCard";

export const createVaultGovActionsProposalOnSafe = async (
  govActions: IVaultGovActionsForm,
  vault: IVault,
  multisig: "growth" | "gov",
  extra: { signer: Signer; chain: Chain; account: string }
): Promise<boolean> => {
  try {
    await switchNetworkAndValidate(extra.chain.id, vault.chainId);

    let multisigAddress = multisig === "growth" ? appChains[vault.chainId].growthMultisig : appChains[vault.chainId].govMultisig;
    multisigAddress = utils.getAddress(multisigAddress ?? "");
    if (!multisigAddress) {
      alert("No gov multisig address for this chain. Please contact Hats team with this error.");
      return false;
    }

    const protocolKit = await Safe.init({
      provider: (extra.signer.provider as any)?.provider as never,
      safeAddress: multisigAddress,
      signer: (await extra.signer.getAddress()) as never,
    });

    const txServiceUrl = getGnosisSafeTxServiceBaseUrl(vault.chainId);
    const safeApiKey = getSafeApiKey();
    const safeService = new SafeApiKit({
      txServiceUrl: `${txServiceUrl}/api`,
      chainId: BigInt(vault.chainId),
      ...(safeApiKey && { apiKey: safeApiKey }),
    });

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

    const nonce = await safeService.getNextNonce(multisigAddress);
    const safeTransaction = await protocolKit.createTransaction({
      transactions: safeTransactionData,
      options: { nonce },
    });
    const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
    const senderSignature = await protocolKit.signTypedData(safeTransaction);
    await safeService.proposeTransaction({
      safeAddress: multisigAddress,
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
