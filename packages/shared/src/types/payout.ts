import { IVaultInfo } from "./types";

export interface IPayoutGraph {
  id: string;
  vault: { id: string };
  chainId: number;
  approvedAt: string; // Date in seconds
  dismissedAt: string; // Date in seconds
  bountyPercentage: string; // Number between 0 and 10000 (for V2 vaults)
  severityIndex: string; // Severity index (for V1 vaults)
  isChallenged: boolean;
  hackerReward: string;
  hackerVestedReward: string;
  governanceHatReward: string;
  hackerHatReward: string;
  committeeReward: string;
  // Computed
  isActive?: boolean; // Is active claim
  isApproved?: boolean; // Is approved claim
  isDismissed?: boolean; // Is dismissed claim
}

export interface IPayoutResponse {
  _id: string;
  vaultInfo: IVaultInfo;
  payoutData: IPayoutData;
  nonce: number;
  txToSign: string;
  minSignaturesNeeded: number;
  signatures: IPayoutSignature[];
  status: PayoutStatus;
  lastActionNeededNotifiedAt: Date;
  payoutTxHash: string; // Only after execution
  payoutClaimId: string; // Only after execution
  payoutDescriptionHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayoutData {
  beneficiary: string;
  title: string;
  severity: string; // Severity name
  percentageToPay: string; // Number between 0 and 100
  severityBountyIndex: string; // Severity index (for V1 vaults)
  explanation: string;
  nftUrl: string;
  additionalInfo: string;
  reportTxid?: string; // Future
  reportDate?: Date; // Future
  encryptedMessage?: string; // Future
  decryptedMessage?: string; // Future
}

export interface IPayoutSignature {
  signature: string;
  signedAt: Date;
  signerAddress: string;
  membersNotified: boolean;
}

export enum PayoutStatus {
  Creating = "creating", // is a draft
  Pending = "pending", // is ready to be signed and waiting signatures
  ReadyToExecute = "readyToExecute", // the minimum signatures are reached and the payout is ready to be executed
  Executed = "executed", // the payout was executed by committee
  Approved = "approved", // the payout was approved
  Rejected = "rejected", // the payout was rejected
}

export const payoutStatusInfo = {
  [PayoutStatus.Creating]: {
    label: "creating",
    color: "--warning-yellow",
  },
  [PayoutStatus.Pending]: {
    label: "collecting",
    color: "--warning-yellow",
  },
  [PayoutStatus.ReadyToExecute]: {
    label: "waitingExecution",
    color: "--turquoise",
  },
  [PayoutStatus.Executed]: {
    label: "executed",
    color: "--warning-yellow",
  },
  [PayoutStatus.Approved]: {
    label: "approved",
    color: "--teal",
  },
  [PayoutStatus.Rejected]: {
    label: "rejected",
    color: "--error-red",
  },
};
