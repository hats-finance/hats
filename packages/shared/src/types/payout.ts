import { ISubmittedSubmission, IVault, IVaultInfo, IVulnerabilitySeverityV2 } from "./types";

export interface IPayoutGraph {
  id: string;
  vault: { id: string };
  chainId: number;
  beneficiary: string;
  payoutDataHash?: string; // Only for v2, null for v1
  approvedAt?: string; // Date in seconds
  dismissedAt?: string; // Date in seconds
  bountyPercentage: string; // Number between 0 and 10000 (for V2 vaults)
  severityIndex: string; // Severity index (for V1 vaults)
  isChallenged: boolean;
  hackerReward: string;
  hackerVestedReward: string;
  governanceHatReward: string;
  hackerHatReward: string;
  committeeReward: string;
  // Computed
  vaultData?: IVault;
  payoutData?: IPayoutData;
  isActive?: boolean; // Is active claim
  isApproved?: boolean; // Is approved claim
  isDismissed?: boolean; // Is dismissed claim
  totalPaidOut?: string; // Total paid out
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

export type GithubIssue = {
  id: number;
  number: number;
  title: string;
  createdBy: number;
  labels: string[];
  validLabels: string[];
  createdAt: string;
  body: string;
  txHash?: string;
  severity?: string;
  bonusPointsLabels: {
    needsFix: boolean;
    needsTest: boolean;
  };
};

export type GithubPR = {
  id: number;
  number: number;
  title: string;
  createdBy: number;
  labels: string[];
  createdAt: string;
  body: string;
  txHash?: string;
  bonusSubmissionStatus: "COMPLETE" | "INCOMPLETE" | "PENDING";
  linkedIssueNumber?: number;
  linkedIssue?: GithubIssue;
};

export type IPayoutData = ISinglePayoutData | ISplitPayoutData;

interface IPayoutDataBase {
  type: PayoutType;
  title: string;
  percentageToPay: string; // Percentage of the whole vault: number between 0 and 100
  explanation: string;
  additionalInfo: string;
  vault?: IVault;
  stopAutocalculation?: boolean;
  depositors?: { address: string; shares: number; ownership: number }[];
  curator?: { username: string; address: string; role: string; percentage: number };
}

export interface ISinglePayoutData extends IPayoutDataBase {
  type: "single";
  beneficiary: string;
  severity: string; // Severity name
  severityBountyIndex: string; // Severity index (for V1 vaults)
  nftUrl: string;
  submissionData?: { id: string; subId: string; idx: number };
  decryptedSubmission?: Omit<ISubmittedSubmission, "linkedVault">; // Omit: workaround to avoid circular dependency;
  ghIssue?: GithubIssue | GithubPR;
}

// Only for v2 vaults
export interface ISplitPayoutData extends IPayoutDataBase {
  type: "split";
  paymentSplitterBeneficiary?: string;
  rewardsConstraints?: {
    severity: string;
    maxReward: string;
    capAmount: string;
    points: IVulnerabilitySeverityV2["points"];
  }[];
  beneficiaries: ISplitPayoutBeneficiary[];
  usingPointingSystem?: boolean;
  paymentPerPoint?: string;
  percentageCapPerPoint?: string;
}

export interface ISplitPayoutBeneficiary {
  beneficiary: string;
  severity: string | "depositor" | "governance" | "curator"; // Severity name
  percentageOfPayout: string; // Number between 0 and 100
  nftUrl: string;
  submissionData?: { id: string; subId: string; idx: number };
  decryptedSubmission?: Omit<ISubmittedSubmission, "linkedVault">; // Omit: workaround to avoid circular dependency;
  ghIssue?: GithubIssue | GithubPR;
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

export type PayoutType = "single" | "split";

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
    color: "--secondary",
  },
  [PayoutStatus.Executed]: {
    label: "waitingApproval",
    color: "--warning-yellow",
  },
  [PayoutStatus.Approved]: {
    label: "approved",
    color: "--secondary-light",
  },
  [PayoutStatus.Rejected]: {
    label: "rejected",
    color: "--error-red",
  },
};
