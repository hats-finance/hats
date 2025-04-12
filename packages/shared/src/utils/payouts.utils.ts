import Safe from "@safe-global/protocol-kit";
import { SafeTransaction } from "@safe-global/types-kit";
import axios, { AxiosResponse } from "axios";
import { BigNumber, Signer, ethers } from "ethers";
import { formatUnits, getAddress, parseUnits } from "ethers/lib/utils.js";
import { HATPaymentSplitterFactory_abi, HATSVaultV1_abi, HATSVaultV2_abi, HATSVaultV3ClaimsManager_abi } from "../abis";
import {
  IPayoutData,
  IPayoutGraph,
  IPayoutResponse,
  ISinglePayoutData,
  ISplitPayoutBeneficiary,
  ISplitPayoutData,
  PayoutType,
} from "../types";
import { ChainsConfig } from "./../config/chains";
import { isValidIpfsHash } from "./ipfs.utils";

function truncate(num: number, fixed: number) {
  const regex = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(regex)?.[0] ?? num.toString();
}

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
  providerUrl: string,
  committee: string,
  payout: IPayoutResponse,
  skipGasEstimation: boolean = false
): Promise<{ tx: SafeTransaction; txHash: string }> => {
  const vaultInfo = payout.vaultInfo;

  const protocolKit = await Safe.init({
    provider: providerUrl,
    safeAddress: committee,
  });

  const percentageToPay = Math.round(Number(payout.payoutData.percentageToPay) * 100);

  if (payout.payoutData.type === "single") {
    // Single payout: only one TX calling the vault contract
    const contractAddress =
      vaultInfo.version === "v1"
        ? vaultInfo.master
        : vaultInfo.version === "v2"
        ? vaultInfo.address
        : vaultInfo.claimsManager ?? "";

    const payoutData = payout.payoutData as ISinglePayoutData;

    let encodedExecPayoutData: string = "";
    if (vaultInfo.version === "v1") {
      const contractInterface = new ethers.utils.Interface(HATSVaultV1_abi);
      encodedExecPayoutData = contractInterface.encodeFunctionData("pendingApprovalClaim", [
        Number(vaultInfo.pid),
        payoutData.beneficiary as `0x${string}`,
        Number(payoutData.severityBountyIndex),
      ]);
    } else if (vaultInfo.version === "v2") {
      const contractInterface = new ethers.utils.Interface(HATSVaultV2_abi);
      encodedExecPayoutData = contractInterface.encodeFunctionData("submitClaim", [
        payoutData.beneficiary as `0x${string}`,
        percentageToPay,
        payout.payoutDescriptionHash,
      ]);
    } else {
      const contractInterface = new ethers.utils.Interface(HATSVaultV3ClaimsManager_abi);
      encodedExecPayoutData = contractInterface.encodeFunctionData("submitClaim", [
        payoutData.beneficiary as `0x${string}`,
        percentageToPay,
        payout.payoutDescriptionHash,
      ]);
    }

    const safeTransaction = await protocolKit.createTransaction({
      transactions: [
        {
          to: contractAddress,
          data: encodedExecPayoutData,
          value: "0",
        },
      ],
      options: skipGasEstimation ? { safeTxGas: "200000" } : undefined,
    });
    const safeTransactionHash = await protocolKit.getTransactionHash(safeTransaction);

    return { tx: safeTransaction, txHash: safeTransactionHash };
  } else {
    // Only works with v2 and v3 vaults
    // Split payout: two TXs with a batch on safe. One to create the payment splitter, and the other to execute the payout.
    // First TX: create payment splitter (this will be the beneficiary of the vault)
    // Second TX: execute payout
    if (vaultInfo.version === "v1") throw new Error("Split payouts are only supported for v2/v3 vaults");

    const paymentSplitterFactoryAddress = ChainsConfig[Number(vaultInfo.chainId)].paymentSplitterFactory;
    if (!paymentSplitterFactoryAddress) throw new Error("Payment splitter factory address not found");

    const vaultContract = {
      address: vaultInfo.version === "v2" ? vaultInfo.address : vaultInfo.claimsManager ?? "",
      interface: new ethers.utils.Interface(vaultInfo.version === "v2" ? HATSVaultV2_abi : HATSVaultV3ClaimsManager_abi),
    };

    const paymentSplitterFactoryContract = {
      address: paymentSplitterFactoryAddress,
      interface: new ethers.utils.Interface(HATPaymentSplitterFactory_abi),
    };

    const payoutData = payout.payoutData as ISplitPayoutData;

    // Join same beneficiaries and sum percentages
    const beneficiariesToIterate = JSON.parse(JSON.stringify(payoutData.beneficiaries)) as ISplitPayoutBeneficiary[];

    // If vault is v3, we will pay 100% of the vault. So we need to add the remaining funds to the depositors and governance
    if (vaultInfo.version === "v3") {
      if (!vaultInfo.hatsGovFee) throw new Error(`Hats governance fee not found on vaultInfo for payout id: ${payout._id}`);
      const hatsGovFee = +vaultInfo.hatsGovFee / 100 / 100;

      const totalToPay = percentageToPay * 1;
      const governancePercentage = totalToPay * hatsGovFee;
      const hackersPercentage = totalToPay * (1 - hatsGovFee);
      const depositorsPercentage = 10000 - totalToPay;

      const hackersPoints = beneficiariesToIterate.reduce((acc, beneficiary) => acc + +beneficiary.percentageOfPayout, 0);
      const governancePoints = (governancePercentage * hackersPoints) / hackersPercentage;
      const depositorsPoints = (depositorsPercentage * hackersPoints) / hackersPercentage;

      // Add depositors as beneficiaries
      if (payout.payoutData.depositors && depositorsPercentage > 0) {
        beneficiariesToIterate.push(
          ...payout.payoutData.depositors.map(
            (depositor) =>
              ({
                beneficiary: depositor.address,
                severity: "depositor",
                nftUrl: "",
                percentageOfPayout: truncate(depositorsPoints * (depositor.ownership / 100), 4),
              } as ISplitPayoutBeneficiary)
          )
        );
      }

      // Add governance ans curator as beneficiary
      // We are doing this because in v3 the govFees on-chain is 0%. We need to calculate it manually
      if (governancePercentage > 0) {
        const govWallet = ChainsConfig[Number(vaultInfo.chainId)].govMultisig;
        if (!govWallet) throw new Error(`Gov wallet not found on ChainsConfig for payout id: ${payout._id}`);

        // Add curator as beneficiary
        let remainingGovPoints = governancePoints;
        if (payout.payoutData.curator) {
          const curatorPercentage = payout.payoutData.curator.percentage / 100;
          if (curatorPercentage < 0 || curatorPercentage > 50) {
            throw new Error(`Invalid curator percentage for payout id: ${payout._id} and percentage ${curatorPercentage}`);
          }
          const curatorFees = curatorPercentage * remainingGovPoints;
          remainingGovPoints = remainingGovPoints - curatorFees;

          beneficiariesToIterate.push({
            beneficiary: payout.payoutData.curator.address,
            severity: "curator",
            nftUrl: "",
            percentageOfPayout: truncate(curatorFees, 4),
          } as ISplitPayoutBeneficiary);
        }

        beneficiariesToIterate.push({
          beneficiary: govWallet,
          severity: "governance",
          nftUrl: "",
          percentageOfPayout: truncate(remainingGovPoints, 4),
        } as ISplitPayoutBeneficiary);
      }
    }

    const beneficiariesJointPercentage = beneficiariesToIterate
      .reduce((acc, beneficiary) => {
        const existingBeneficiary = acc.find((b) => b.beneficiary.toLowerCase() === beneficiary.beneficiary.toLowerCase());
        if (existingBeneficiary) {
          existingBeneficiary.percentageOfPayout = truncate(
            +truncate(+existingBeneficiary.percentageOfPayout, 4) + +truncate(+beneficiary.percentageOfPayout, 4),
            4
          );
        } else {
          acc.push(beneficiary);
        }
        return acc;
      }, [] as ISplitPayoutBeneficiary[])
      .map((ben) => ({ ...ben, beneficiary: getAddress(ben.beneficiary) }));

    // Payout payment splitter creation TX
    const encodedPaymentSplitterCreation = paymentSplitterFactoryContract.interface.encodeFunctionData(
      "createHATPaymentSplitter",
      [
        beneficiariesJointPercentage.map((beneficiary) => beneficiary.beneficiary as `0x${string}`),
        beneficiariesJointPercentage.map((beneficiary) =>
          BigNumber.from(Math.round(Number(beneficiary.percentageOfPayout) * 10 ** 10))
        ),
      ]
    );

    // Payout execution TX
    // If v3, the percentage to pay is always 100%. We will pay to the beneficiaries and the remaining is going to depositors/governance.
    const encodedExecutePayout = vaultContract.interface.encodeFunctionData("submitClaim", [
      payoutData.paymentSplitterBeneficiary as `0x${string}`,
      vaultInfo.version === "v3" ? 10000 : percentageToPay,
      payout.payoutDescriptionHash,
    ]);

    const safeTransaction = await protocolKit.createTransaction({
      transactions: [
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
      options: skipGasEstimation ? { safeTxGas: "200000" } : undefined,
    });
    const safeTransactionHash = await protocolKit.getTransactionHash(safeTransaction);

    return { tx: safeTransaction, txHash: safeTransactionHash };
  }
};

export const getAllPayoutsWithData = async (env: "all" | "testnet" | "mainnet" = "mainnet"): Promise<IPayoutGraph[]> => {
  try {
    const GET_ALL_PAYOUTS = `
      query getPayouts {
        payouts: claims(first: 1000) {
          id
          vault {
            id
          }
          payoutDataHash: claim
          beneficiary: claimer
          approvedAt
          dismissedAt
          bountyPercentage
          severityIndex: severity
          hackerReward
          hackerVestedReward
          governanceHatReward
          hackerHatReward
          committeeReward
          isChallenged
        }
      }
    `;

    const subgraphsRequests = Object.values(ChainsConfig)
      .filter((chain) => (env === "testnet" ? chain.chain.testnet : env === "mainnet" ? !chain.chain.testnet : true))
      .map(async (chain) => {
        return {
          chainId: chain.chain.id,
          request: await axios.post(
            chain.subgraph,
            JSON.stringify({
              query: GET_ALL_PAYOUTS,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ),
        };
      });

    const subgraphsResponses = await Promise.allSettled(subgraphsRequests);
    const fulfilledResponses = subgraphsResponses.filter((response) => response.status === "fulfilled");
    const subgraphsData = fulfilledResponses.map(
      (res) => (res as PromiseFulfilledResult<{ chainId: number; request: AxiosResponse<any> }>).value
    );

    const payouts: IPayoutGraph[] = [];
    for (let i = 0; i < subgraphsData.length; i++) {
      const chainId = subgraphsData[i].chainId;

      if (!subgraphsData[i].request.data) continue;
      if (!subgraphsData[i].request.data?.data) continue;
      if (!subgraphsData[i].request.data || !subgraphsData[i].request.data?.data?.payouts) continue;

      for (const payout of subgraphsData[i].request.data.data.payouts) {
        payouts.push({
          chainId,
          ...payout,
        });
      }
    }

    const loadPayoutDescription = async (payout: IPayoutGraph): Promise<IPayoutData | undefined> => {
      if (isValidIpfsHash(payout.payoutDataHash)) {
        try {
          const dataResponse = await fetch(`https://ipfs2.hats.finance/ipfs/${payout.payoutDataHash}`);
          if (dataResponse.status === 200) {
            const object = await dataResponse.json();
            return object as any;
          }
          return undefined;
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    // Load descriptions
    const getPayoutsData = async (payoutsToFetch: IPayoutGraph[]): Promise<IPayoutGraph[]> =>
      Promise.all(
        payoutsToFetch.map(async (payout) => {
          const payoutData = (await loadPayoutDescription(payout)) as IPayoutData | undefined;

          if (payoutData?.type === "single") {
            if (payoutData?.decryptedSubmission) delete payoutData.decryptedSubmission;
          } else {
            for (const beneficiary of payoutData?.beneficiaries ?? []) {
              if (beneficiary?.decryptedSubmission) delete beneficiary.decryptedSubmission;
            }
          }

          const getV3TotalPaidOut = () => {
            const vault = payout.payoutData?.vault;

            if (!vault) return undefined;
            if (vault.version !== "v3") return undefined;
            if (Number(payout.bountyPercentage) !== 10000) return undefined;

            const realGovFee = Number(vault.governanceHatRewardSplit) / 100 / 100;
            const realPaidPercentage = Number(payout.payoutData?.percentageToPay) / 100;

            const paidOut = BigNumber.from(payout.hackerReward ?? "0").add(BigNumber.from(payout.hackerVestedReward ?? "0"));
            const paidOutHackers =
              Number(formatUnits(paidOut, vault.stakingTokenDecimals)) * realPaidPercentage * (1 - realGovFee);

            return !!payout.approvedAt ? parseUnits(`${paidOutHackers}`, vault.stakingTokenDecimals).toString() : undefined;
          };

          return {
            ...payout,
            payoutData,
            isActive: !payout.dismissedAt && !payout.approvedAt,
            isApproved: !!payout.approvedAt,
            isDismissed: !!payout.dismissedAt,
            totalPaidOut: !!payout.approvedAt
              ? getV3TotalPaidOut() ??
                BigNumber.from(payout.hackerReward ?? "0")
                  .add(BigNumber.from(payout.hackerVestedReward ?? "0"))
                  .toString()
              : undefined,
          } as IPayoutGraph;
        })
      );

    const payoutsWithDescription = await getPayoutsData(payouts);

    return payoutsWithDescription;
  } catch (error) {
    console.log(error);
    return [];
  }
};
