import Safe from "@safe-global/safe-core-sdk";
import { SafeTransaction } from "@safe-global/safe-core-sdk-types";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { ethers } from "ethers";
import { HATSVaultV1_abi, HATSVaultV2_abi } from "../abis";
import { IPayoutData, ISinglePayoutData, ISplitPayoutBeneficiary, ISplitPayoutData, IVaultInfo, PayoutType } from "../types";

export const createNewPayoutData = (type: PayoutType): IPayoutData => {
  if (type === "single") {
    return {
      type,
      beneficiary: "",
      title: "",
      severity: "",
      percentageToPay: "",
      severityBountyIndex: "",
      explanation: "",
      nftUrl: "",
      additionalInfo: "Submission tx: \n\nSubmission link: \n\nDecrypted submission: ",
    } as ISinglePayoutData;
  } else {
    return {
      type,
      title: "",
      explanation: "",
      additionalInfo: "",
      beneficiaries: [createNewSplitPayoutBeneficiary()],
    } as ISplitPayoutData;
  }
};

export const createNewSplitPayoutBeneficiary = (): ISplitPayoutBeneficiary => {
  return {
    beneficiary: "",
    severity: "",
    percentageToPay: "",
    nftUrl: "",
  };
};

export const getExecutePayoutSafeTransaction = async (
  provider: ethers.providers.Provider,
  committee: string,
  vaultInfo: IVaultInfo,
  params: {
    beneficiary: string;
    descriptionHash: string;
    bountyPercentageOrSeverityIndex: string | number;
  }
): Promise<SafeTransaction> => {
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider });
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: committee });

  const contractAddress = vaultInfo.version === "v1" ? vaultInfo.master : vaultInfo.address;
  const vaultAbi = vaultInfo.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
  const method = vaultInfo.version === "v1" ? "pendingApprovalClaim" : "submitClaim";

  const vaultInterface = new ethers.utils.Interface(vaultAbi);
  let encodedExecPayoutData: string = "";

  if (vaultInfo.version === "v1") {
    encodedExecPayoutData = vaultInterface.encodeFunctionData(method, [
      Number(vaultInfo.pid),
      params.beneficiary as `0x${string}`,
      Number(params.bountyPercentageOrSeverityIndex),
    ]);
  } else {
    encodedExecPayoutData = vaultInterface.encodeFunctionData(method, [
      params.beneficiary as `0x${string}`,
      Number(params.bountyPercentageOrSeverityIndex) * 100,
      params.descriptionHash,
    ]);
  }

  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData: {
      to: contractAddress,
      data: encodedExecPayoutData,
      value: "0",
      nonce: await safeSdk.getNonce(),
    },
  });

  return safeTransaction;
};
