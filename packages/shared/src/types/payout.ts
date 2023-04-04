export interface IPayoutResponse {
  _id: string;
  vaultAddress: string;
  chainId: number;
  payoutData: IPayoutData;
  nonce: number;
  txToSign: string;
  minSignaturesNeeded: number;
  signatures: IPayoutSignature[];
  status: PayoutStatus;
  lastActionNeededNotifiedAt: Date;
  payoutTxHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayoutData {
  beneficiary: string;
  title: string;
  severity: string;
  percentageToPay: string; // Number between 0 and 100
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
  UnderReview = "underReview", // the payout is under arbitrator review
  Executed = "executed", // the payout was executed by arbitrator
  Rejected = "rejected", // the payout was rejected by arbitrator
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
  [PayoutStatus.UnderReview]: {
    label: "underReview",
    color: "--teal",
  },
  [PayoutStatus.Executed]: {
    label: "executed",
    color: "--turquoise",
  },
  [PayoutStatus.Rejected]: {
    label: "rejected",
    color: "--error-red",
  },
};
