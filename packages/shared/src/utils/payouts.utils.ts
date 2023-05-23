import Safe from "@safe-global/safe-core-sdk";
import { SafeTransaction } from "@safe-global/safe-core-sdk-types";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { BigNumber, ethers } from "ethers";
import { HATPaymentSplitterFactory_abi, HATSVaultV1_abi, HATSVaultV2_abi } from "../abis";
import { IPayoutData, IPayoutResponse, ISinglePayoutData, ISplitPayoutBeneficiary, ISplitPayoutData, PayoutType } from "../types";
import { ChainsConfig } from "./../config/chains";

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
    percentageOfPayout: "",
    nftUrl: "",
  };
};

export const getExecutePayoutSafeTransaction = async (
  provider: ethers.providers.Provider,
  committee: string,
  payout: IPayoutResponse
): Promise<{ tx: SafeTransaction; txHash: string }> => {
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider });
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: committee });

  const vaultInfo = payout.vaultInfo;

  if (payout.payoutData.type === "single") {
    // Single payout: only one TX calling the vault contract
    const contractAddress = vaultInfo.version === "v1" ? vaultInfo.master : vaultInfo.address;

    const payoutData = payout.payoutData as ISinglePayoutData;

    let encodedExecPayoutData: string = "";
    if (vaultInfo.version === "v1") {
      const contractInterface = new ethers.utils.Interface(HATSVaultV1_abi);
      encodedExecPayoutData = contractInterface.encodeFunctionData("pendingApprovalClaim", [
        Number(vaultInfo.pid),
        payoutData.beneficiary as `0x${string}`,
        Number(payoutData.severityBountyIndex),
      ]);
    } else {
      const contractInterface = new ethers.utils.Interface(HATSVaultV2_abi);
      encodedExecPayoutData = contractInterface.encodeFunctionData("submitClaim", [
        payoutData.beneficiary as `0x${string}`,
        Math.round(Number(payoutData.percentageToPay) * 100),
        payout.payoutDescriptionHash,
      ]);
    }

    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData: {
        to: contractAddress,
        data: encodedExecPayoutData,
        value: "0",
      },
    });
    const safeTransactionHash = await safeSdk.getTransactionHash(safeTransaction);

    return { tx: safeTransaction, txHash: safeTransactionHash };
  } else {
    // Only works with v2 vaults
    // Split payout: two TXs with a batch on safe. One to create the payment splitter, and the other to execute the payout.
    // First TX: create payment splitter (this will be the beneficiary of the vault)
    // Second TX: execute payout
    if (vaultInfo.version === "v1") throw new Error("Split payouts are only supported for v2 vaults");

    const paymentSplitterFactoryAddress = ChainsConfig[Number(vaultInfo.chainId)].paymentSplitterFactory;
    if (!paymentSplitterFactoryAddress) throw new Error("Payment splitter factory address not found");

    const vaultContract = {
      address: vaultInfo.address,
      interface: new ethers.utils.Interface(HATSVaultV2_abi),
    };

    const paymentSplitterFactoryContract = {
      address: paymentSplitterFactoryAddress,
      interface: new ethers.utils.Interface(HATPaymentSplitterFactory_abi),
    };

    const payoutData = payout.payoutData as ISplitPayoutData;


    // Payout payment splitter creation TX
    const encodedPaymentSplitterCreation = paymentSplitterFactoryContract.interface.encodeFunctionData(
      "createHATPaymentSplitter",
      [
        payoutData.beneficiaries.map((beneficiary) => beneficiary.beneficiary as `0x${string}`),
        payoutData.beneficiaries.map((beneficiary) => BigNumber.from(Math.round(Number(beneficiary.percentageOfPayout) * 10 ** 10))),
      ]
    );

    // Payout execution TX
    const encodedExecutePayout = vaultContract.interface.encodeFunctionData("submitClaim", [
      payoutData.paymentSplitterBeneficiary as `0x${string}`,
      Math.round(Number(payoutData.percentageToPay) * 100),
      payout.payoutDescriptionHash,
    ]);

    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData: [
        {
          to: paymentSplitterFactoryAddress,
          data: encodedPaymentSplitterCreation,
          value: "0",
        },
        {
          to: vaultContract.address,
          data: encodedExecutePayout,
          value: "0",
        },
      ],
    });
    const safeTransactionHash = await safeSdk.getTransactionHash(safeTransaction);

    return { tx: safeTransaction, txHash: safeTransactionHash };
  }
};
