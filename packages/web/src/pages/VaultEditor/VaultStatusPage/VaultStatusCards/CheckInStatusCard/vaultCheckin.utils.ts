import {
  HATSVaultV1_abi,
  HATSVaultV2_abi,
  HATSVaultV3ClaimsManager_abi,
  IVault,
  getGnosisSafeTxServiceBaseUrl,
} from "@hats.finance/shared";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/types-kit";
import { Signer, ethers } from "ethers";
import { utils } from "ethers";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { Chain } from "wagmi";

export const createVaultCheckInProposalOnSafe = async (
  vault: IVault,
  extra: { signer: Signer; chain: Chain; account: string }
): Promise<boolean> => {
  try {
    await switchNetworkAndValidate(extra.chain.id, vault.chainId);

    const committeeMultisig = utils.getAddress(vault.committee);

    const protocolKit = await Safe.init({
      provider: (extra.signer.provider as any)?.provider as never,
      safeAddress: committeeMultisig,
      signer: (await extra.signer.getAddress()) as never,
    });

    const txServiceUrl = getGnosisSafeTxServiceBaseUrl(vault.chainId);
    const safeService = new SafeApiKit({ txServiceUrl: `${txServiceUrl}/api`, chainId: BigInt(vault.chainId) });

    const vaultAbi =
      vault?.version === "v1" ? HATSVaultV1_abi : vault?.version === "v2" ? HATSVaultV2_abi : HATSVaultV3ClaimsManager_abi;
    const contractAddress =
      vault.version === "v1" ? vault.master.address : vault.version === "v2" ? vault.id : vault.claimsManager;

    const vaultInterface = new ethers.utils.Interface(vaultAbi);
    const safeTransactionData = [] as MetaTransactionData[];

    const params = vault.version === "v1" ? [vault?.pid] : [];
    const txData = vaultInterface.encodeFunctionData("committeeCheckIn", params);
    safeTransactionData.push({
      to: utils.getAddress(contractAddress),
      data: txData,
      value: "0",
    });

    const nonce = await safeService.getNextNonce(committeeMultisig);
    const safeTransaction = await protocolKit.createTransaction({
      transactions: safeTransactionData,
      options: { nonce },
    });
    const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
    const senderSignature = await protocolKit.signTypedData(safeTransaction);
    await safeService.proposeTransaction({
      safeAddress: committeeMultisig,
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
